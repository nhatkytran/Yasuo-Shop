import { Request } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
import { get } from 'lodash';

import AppError from '../utils/appError';
import { signAccessJWT, verifyJWT } from '../utils/jwt';
import Session from '../models/sessions/session.model';
import { SessionDocument } from '../models/sessions/schemaDefs';
import { findUser, preventOAuthUser } from './user.service';
import { UserObject } from './user.service';
import { UserDocument } from '../models/users/schemaDefs';

// Throw error when banned user performs action
const preventBannedUser = (isBanned?: any) => {
  if (Boolean(isBanned))
    throw new AppError({
      message: 'Your account has been banned!',
      statusCode: 403,
    });
};

// Throw error when inactive user
const preventInactiveUser = (active?: any): void => {
  if (!Boolean(active))
    throw new AppError({
      message:
        'First you need to activate you account at /api/v1/users/activateCode/:email',
      statusCode: 401,
    });
};

// Validate password //////////

interface ValidatePasswordOptions extends UserObject {
  password: string;
}

export const validatePassword = async ({
  user,
  password,
}: ValidatePasswordOptions): Promise<void> => {
  preventOAuthUser(user.googleID);
  preventBannedUser(user.ban);
  preventInactiveUser(user.active);

  if (!(await user.comparePassword(password)))
    throw new AppError({ message: 'Incorrect password!', statusCode: 401 });
};

// Create session //////////

type CreateSessionOptions = {
  userID: mongoose.Schema.Types.ObjectId;
  userAgent: string;
};

export const createSession = async ({
  userID,
  userAgent,
}: CreateSessionOptions): Promise<SessionDocument> => {
  const session = await Session.create({ user: userID, userAgent });
  return session as SessionDocument;
};

// Find Session //////////

type FindSessionOptions = {
  query: FilterQuery<SessionDocument>;
  selectFields?: Array<keyof SessionDocument>;
};

export const findSession = async ({
  query,
  selectFields,
}: FindSessionOptions): Promise<SessionDocument> => {
  let mongooseQuery = Session.findOne(query);

  selectFields?.forEach(
    field => (mongooseQuery = mongooseQuery.select(`+${field}`))
  );

  const session = await mongooseQuery;

  if (!session)
    throw new AppError({ message: 'Session not found!', statusCode: 404 });

  return session;
};

// Get jwts from headers and cookies //////////

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

const unauthenticatedError = (message: string) =>
  new AppError({
    message,
    statusCode: 401,
  });

const checkSession = async (
  sessionID: mongoose.Schema.Types.ObjectId
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

const checkUser = async (
  userID: mongoose.Schema.Types.ObjectId
): Promise<UserDocument | never> => {
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

type CheckAccessJWTOptions = {
  accessToken: string;
  hasRefreshToken: boolean;
};

export const checkAccessJWT = async ({
  accessToken,
  hasRefreshToken,
}: CheckAccessJWTOptions): Promise<UserDocument | null | never> => {
  const { expired, decoded } = verifyJWT(accessToken);

  if (decoded) {
    const { userID, sessionID } = decoded;

    const session = await checkSession(sessionID);
    const user = await checkUser(userID);

    preventOldJWTs(user, session);

    return user;
  }

  if (!expired)
    throw unauthenticatedError('Invalid token! Please sign in again.');

  if (expired && !hasRefreshToken)
    throw unauthenticatedError('Token has expired! Please login again.');

  return null; // Invalid accessToken, but still has refreshToken
};

// Verify and handle errors for refreshToken //////////

export const checkRefreshJWT = async (
  refreshToken: string | undefined
): Promise<{ user: UserDocument; newAccessToken: string } | never> => {
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

    return { user, newAccessToken };
  }

  if (expired)
    throw unauthenticatedError('Token has expired! Please login again.');

  throw unauthenticatedError('Invalid token! Please sign in again.');
};
