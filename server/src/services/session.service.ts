import { Request } from 'express';
import qs from 'qs';
import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { get } from 'lodash';
import axios from 'axios';
import config from 'config';

import logger from '../utils/logger';
import AppError from '../utils/appError';
import { signAccessJWT, verifyJWT } from '../utils/jwt';
import Session from '../models/sessions/session.model';
import User from '../models/users/user.model';
import { SessionDocument } from '../models/sessions/schemaDefs';
import { findUser } from './user.service';
import { UserDocument } from '../models/users/schemaDefs';
import APIFeatures from '../utils/apiFeatures';
import dateFormat from '../utils/dateFormat';

import {
  FindAllEntities,
  UserAndToken,
  UserObject,
  createActionToken,
  handleSendEmails,
  preventBannedUser,
  preventDeletedUser,
  preventInactiveUser,
  preventInvalidToken,
  preventNotIssuedToken,
  preventOAuthUser,
} from './common.service';

// Helpers //////////

export const unauthenticatedError = (message: string) =>
  new AppError({
    message,
    statusCode: 401,
  });

// Google OAuth //////////

const googleID = config.get<string>('googleID');
const googleSecret = config.get<string>('googleSecret');
const googleRedirect = config.get<string>('googleRedirect');

export const signinGoogleConsentUrl = (): string => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const qs = new URLSearchParams({
    redirect_uri: googleRedirect,
    client_id: googleID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: scopes.join(' '),
  });

  return `${config.get<string>('googleRootUrl')}?${qs.toString()}`;
};

interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export const getGoogleOAuthTokens = async (
  code: string
): Promise<GoogleTokensResult> => {
  try {
    const qsOptions = {
      code,
      client_id: googleID,
      client_secret: googleSecret,
      redirect_uri: googleRedirect,
      grant_type: 'authorization_code',
    };

    const { data } = await axios.post<GoogleTokensResult>(
      'https://oauth2.googleapis.com/token',
      qs.stringify(qsOptions),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return data;
  } catch (error: any) {
    logger.error(error, 'Failed to fetch Google OAuth Tokens!');
    throw error;
  }
};

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

type GoogleUserOptions = { id_token: string; access_token: string };

export async function getGoogleUser({
  id_token,
  access_token,
}: GoogleUserOptions): Promise<GoogleUserResult> {
  try {
    const { data: googleUser } = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      { headers: { Authorization: `Bearer ${id_token}` } }
    );

    if (!googleUser.verified_email)
      throw new AppError({
        message: 'Google account is not verified!',
        statusCode: 403,
      });

    return googleUser;
  } catch (error: any) {
    logger.error(error, 'Failed to fetch Google OAuth user!');
    throw error;
  }
}

export const upsertGoogleUser = async (
  googleUser: GoogleUserResult
): Promise<{ user: UserDocument; isNew: Boolean }> => {
  const { name, email, id, picture } = googleUser;

  const { value, lastErrorObject } = await User.findOneAndUpdate(
    { email },
    { name, email, googleID: id, active: true, photo: picture },
    { upsert: true, new: true, includeResultMetadata: true }
  );

  return {
    user: value as UserDocument,
    isNew: !lastErrorObject?.updatedExisting,
  };
};

export const createGoogleToken = async ({ user }: UserObject) =>
  await createActionToken({ user, type: 'google' });

export const sendGoogleEmail = async ({ user }: UserObject): Promise<void> =>
  await handleSendEmails({ user, sendMethod: 'sendWelcome' });

export const checkGoogleToken = async ({
  user,
  token,
}: UserAndToken): Promise<void> => {
  preventDeletedUser(user.delete);
  preventBannedUser(user.ban);

  preventNotIssuedToken({
    tokenField: user.googleToken,
    codeUrl: '/api/v1/sessions/oauth/google/consent',
  });

  preventInvalidToken({ token, rawToken: user.googleToken! });

  user.googleToken = undefined;

  await user.save({ validateModifiedOnly: true });
};

// Validate password //////////

interface ValidatePasswordOptions extends UserObject {
  password: string;
}

export const validatePassword = async ({
  user,
  password,
}: ValidatePasswordOptions): Promise<void> => {
  preventDeletedUser(user.delete);
  preventBannedUser(user.ban);
  preventOAuthUser(user.googleID);
  preventInactiveUser(user.active);

  const maxAttempts = 5;
  const nextOneHour = () => new Date(Date.now() + 60 * 60 * 1000);
  const isInvalidTime = () => Date.now() < user.signinTimestamp!.getTime();

  // There is no sign-in attempts remaining -> throw error
  if (user.signinAttempts === maxAttempts && isInvalidTime()) {
    const date = dateFormat({ date: user.signinTimestamp!, hasHour: true });

    throw new AppError({
      message: `There is no sign-in attempts remaining. Please try again after ${date}.`,
      statusCode: 403,
    });
  }

  // Password is correct -> sign in and reset attempts
  if (await user.comparePassword(password)) {
    user.signinAttempts = 0;
    user.signinTimestamp = new Date();

    await user.save({ validateModifiedOnly: true });
    return;
  }

  // Password is not correct -> update attempts
  user.signinAttempts = isInvalidTime() ? user.signinAttempts! + 1 : 1;
  user.signinTimestamp = nextOneHour();

  await user.save({ validateModifiedOnly: true });

  let messageMore: string = '';
  const attemptsRemaining = maxAttempts - user.signinAttempts!;

  if (!attemptsRemaining) {
    const date = dateFormat({ date: user.signinTimestamp, hasHour: true });
    messageMore = ` Please try again after ${date}.`;
  }

  throw unauthenticatedError(
    `Incorrect password! Attempts remaining: ${attemptsRemaining}.${messageMore}`
  );
};

// Create session //////////

type CreateSessionOptions = {
  userID: mongoose.Schema.Types.ObjectId;
  userAgent?: string;
};

export const createSession = async ({
  userID,
  userAgent = '',
}: CreateSessionOptions): Promise<SessionDocument> => {
  const session = await Session.create({ user: userID, userAgent });
  return session as SessionDocument;
};

// Find All Sessions //////////

export const findAllSessions: FindAllEntities<SessionDocument> = async ({
  reqQuery = {},
  findOptions = {},
}) => {
  const options = { model: Session, reqQuery, findOptions };
  const features = await APIFeatures(options);

  features.filter().sort().project().paginate();

  return await features.result();
};

// Find Session //////////

interface FindSessionQueryOptions extends QueryOptions {
  fields?: string | string[];
}

type FindSessionOptions = {
  query: FilterQuery<SessionDocument>;
  queryOptions?: FindSessionQueryOptions;
};

export const findSession = async ({
  query,
  queryOptions = {},
}: FindSessionOptions): Promise<SessionDocument> => {
  let mongooseQuery = Session.findOne(query);

  let { fields } = queryOptions;
  let selectOptions: { [key: string]: true } = {};

  if (fields) {
    if (!Array.isArray(fields)) fields = fields.split(',');
    fields.forEach(field => (selectOptions[field] = true));

    mongooseQuery = mongooseQuery.select(fields);
  }

  const session = await mongooseQuery;

  if (!session)
    throw new AppError({ message: 'Session not found!', statusCode: 404 });

  return session;
};

// Get jwts from headers and cookies //////////

// active check by signin -> only active is true can sign jwts
export const protectCheckUserState = (user: UserDocument) => {
  preventBannedUser(user.ban);
  preventDeletedUser(user.delete);
};

export const getJWTs = (req: Request) => {
  const accessToken: string | undefined =
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '') ||
    get(req, 'cookies.accessToken');

  const refreshToken: string | undefined =
    get(req, 'headers.x-refresh') || get(req, 'cookies.refreshToken');

  if (!accessToken && !refreshToken)
    throw unauthenticatedError('Please sign in to get access!');

  return { accessToken, refreshToken };
};

// protect helpers //////////

const checkSession = async (
  sessionID: string
): Promise<SessionDocument | never> => {
  try {
    const session = await findSession({ query: { _id: sessionID } });

    if (!session.valid) throw new Error();

    return session;
  } catch (error: any) {
    throw unauthenticatedError(
      'Invalid session! Please sign in to get access.'
    );
  }
};

const checkUser = async (userID: string): Promise<UserDocument | never> => {
  try {
    const user = await findUser({
      query: { _id: userID },
      selectFields: ['passwordChangedAt'],
    });

    return user;
  } catch (error: any) {
    throw unauthenticatedError(
      'The user belongs to this token does not longer exist!'
    );
  }
};

const preventOldJWTs = (user: UserDocument, session: SessionDocument): void => {
  if (user.changedPassword(session.createdAt.getTime()))
    throw unauthenticatedError(
      'User recently changed password! Please login again.'
    );
};

// Verify and handle errors for accessToken //////////

type CheckAccessJWTOptions = { accessToken: string; hasRefreshToken: boolean };
type CheckAccessJWTData = { user: UserDocument; sessionID: string };

export const checkAccessJWT = async ({
  accessToken,
  hasRefreshToken,
}: CheckAccessJWTOptions): Promise<CheckAccessJWTData | null | never> => {
  const { expired, decoded } = verifyJWT(accessToken);

  if (decoded) {
    const { userID, sessionID } = decoded;

    const session = await checkSession(sessionID);
    const user = await checkUser(userID);

    preventOldJWTs(user, session);

    return { user, sessionID };
  }

  if (!expired)
    throw unauthenticatedError('Invalid token! Please sign in again.');

  if (expired && !hasRefreshToken)
    throw unauthenticatedError('Token has expired! Please login again.');

  return null; // Invalid accessToken, but still has refreshToken
};

// Verify and handle errors for refreshToken //////////

interface CheckRefreshJWTData extends CheckAccessJWTData {
  newAccessToken: string;
}

export const checkRefreshJWT = async (
  refreshToken: string | undefined
): Promise<CheckRefreshJWTData | never> => {
  if (!refreshToken)
    throw unauthenticatedError('Please sign in to get access.');

  const { expired, decoded } = verifyJWT(refreshToken);

  if (decoded) {
    const { userID, sessionID } = decoded;

    const session = await checkSession(sessionID);
    const user = await checkUser(userID);

    preventOldJWTs(user, session);

    const newAccessToken = signAccessJWT({
      userID: user._id,
      sessionID: session._id,
    });

    return { user, sessionID, newAccessToken };
  }

  if (expired)
    throw unauthenticatedError('Token has expired! Please login again.');

  throw unauthenticatedError('Invalid token! Please sign in again.');
};

// authorization //////////

type CheckIsAuthorizedOptions = {
  user: UserDocument;
  roles: Array<UserDocument['role']>;
};

export const checkIsAuthorized = ({
  user,
  roles,
}: CheckIsAuthorizedOptions): void => {
  if (!user) throw unauthenticatedError('Please sign in to get access.');

  if (!roles.includes(user.role))
    throw new AppError({
      message: "You don't have permission to perform this action!",
      statusCode: 403,
    });
};

// Deactivate all sesions //////////

type UpdateAllSessionsOptions = {
  filter: FilterQuery<SessionDocument>;
  update: UpdateQuery<SessionDocument>;
};

export const updateAllSessions = async ({
  filter,
  update,
}: UpdateAllSessionsOptions) => {
  const { modifiedCount, matchedCount } = await Session.updateMany(
    filter,
    update
  );

  return { modifiedCount, matchedCount };
};

// Delete all sesions //////////

export const findAndDeleteAllSessions = async ({
  filter,
}: {
  filter: FilterQuery<SessionDocument>;
}) => await Session.deleteMany(filter);

// Deactivate session by id //////////

type FindAndUpdateSessionOptions = {
  sessionID: string;
  update: UpdateQuery<SessionDocument>;
  options: QueryOptions;
};

export const findAndUpdateSession = async ({
  sessionID,
  update,
  options,
}: FindAndUpdateSessionOptions): Promise<SessionDocument | null> => {
  const session = await Session.findByIdAndUpdate(sessionID, update, options);

  if (!session) return null;
  return session;
};

// Delete session by id //////////

export const findAndDeleteSession = async ({
  sessionID,
}: {
  sessionID: string;
}) => await Session.findByIdAndDelete(sessionID);
