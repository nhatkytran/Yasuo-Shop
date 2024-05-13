import { NextFunction, Request, Response } from 'express';
import { QueryOptions } from 'mongoose';
import config from 'config';

import env from '../utils/env';
import sendSuccess from '../utils/sendSuccess';
import catchAsync from '../utils/catchAsync';

import {
  sendAccessJWTCookie,
  sendRefreshJWTCookie,
  signAccessJWT,
  signRefreshJWT,
} from '../utils/jwt';

import { UserDocument, UserInput } from '../models/users/schemaDefs';
import { findUser } from '../services/user.service';

import {
  GetAllSessionsInput,
  GetSessionInput,
  SigninGoogleInput,
  SigninUserInput,
} from '../schemas/session.schema';

import {
  checkAccessJWT,
  checkGoogleToken,
  checkIsAuthorized,
  checkRefreshJWT,
  createGoogleToken,
  createSession,
  findAllSessions,
  findAndDeleteAllSessions,
  findAndDeleteSession,
  findAndUpdateSession,
  findSession,
  getGoogleOAuthTokens,
  getGoogleUser,
  getJWTs,
  protectCheckUserState,
  sendGoogleEmail,
  signinGoogleConsentUrl,
  updateAllSessions,
  upsertGoogleUser,
  validatePassword,
} from '../services/session.service';

// Authentication //////////

const sendSigninTokens = async (
  req: Request,
  res: Response,
  user: UserDocument
) => {
  const session = await createSession({
    userID: user._id,
    userAgent: req.get('user-agent') || '',
  });

  const tokenOptions = { userID: user._id, sessionID: session._id };
  const accessToken = signAccessJWT(tokenOptions);
  const refreshToken = signRefreshJWT(tokenOptions);

  if (!env.test) {
    sendAccessJWTCookie(req, res, accessToken);
    sendRefreshJWTCookie(req, res, refreshToken);
  }

  sendSuccess(res, { accessToken, refreshToken });
};

export const signin = catchAsync(
  async (req: Request<{}, {}, SigninUserInput['body']>, res: Response) => {
    const { email, password } = req.body;

    const user = await findUser({
      query: { email },
      selectFields: ['password'],
    });

    await validatePassword({ user, password });
    await sendSigninTokens(req, res, user);
  }
);

export const signinGoogleConsent = (req: Request, res: Response) =>
  res.redirect(signinGoogleConsentUrl());

export const signinGoogleCallback = catchAsync(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const error = req.query.error as string;
    const clientOriginUrl = config.get<string>('clientOriginUrl');

    if (error === 'access_denied')
      return res.redirect(`${clientOriginUrl}?googleError=${error}`);

    const { id_token, access_token } = await getGoogleOAuthTokens(code);
    const googleUser = await getGoogleUser({ id_token, access_token }); // jwt.decode(id_token);

    const { user, isNew } = await upsertGoogleUser(googleUser);

    const token = await createGoogleToken({ user });
    if (env.dev || env.test) console.log(token);

    if (env.prod && isNew) sendGoogleEmail({ user });

    res.redirect(`${clientOriginUrl}?googleToken=${token}`);
  }
);

export const signinGoogleTokens = catchAsync(
  async (req: Request<{}, {}, SigninGoogleInput['body']>, res: Response) => {
    const { email, googleToken } = req.body;

    const user = await findUser({
      query: { email },
      selectFields: ['googleToken'],
    });

    await checkGoogleToken({ user, token: googleToken });
    await sendSigninTokens(req, res, user);
  }
);

export const signout = catchAsync(async (req: Request, res: Response) => {
  const { sessionID } = res.locals;

  await findAndUpdateSession({
    sessionID,
    update: { valid: false },
    options: { new: true, runValidators: true },
  });

  sendSuccess(res, { message: 'Sign out successfully.' });
});

export const signoutEverywhere = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = res.locals;

    const { modifiedCount, matchedCount } = await updateAllSessions({
      filter: { user: user._id },
      update: { valid: false },
    });

    sendSuccess(res, {
      message: 'Sign out everywhere successfully.',
      modifiedCount,
      matchedCount,
    });
  }
);

// Authorization //////////

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = getJWTs(req);

    if (accessToken) {
      const options = { accessToken, hasRefreshToken: Boolean(refreshToken) };
      const data = await checkAccessJWT(options);

      if (data) {
        const { user, sessionID } = data;

        protectCheckUserState(user);

        res.locals.user = user;
        res.locals.sessionID = sessionID;

        return next();
      }
    }

    const { user, sessionID, newAccessToken } = await checkRefreshJWT(
      refreshToken
    );

    protectCheckUserState(user);

    res.locals.user = user;
    res.locals.sessionID = sessionID;

    res.setHeader('x-access-token', newAccessToken);
    sendAccessJWTCookie(req, res, newAccessToken);

    next();
  }
);

export const restrictTo = (...roles: Array<UserInput['role']>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    checkIsAuthorized({ user, roles });
    next();
  });

// CRUD Sessions - only for admin //////////

// Get all sessions (also for one user)
export const getAllSessions = catchAsync(
  async (req: Request<GetAllSessionsInput['params']>, res: Response) => {
    const { userID } = req.params;
    let findOptions = {};

    if (userID) {
      const user = await findUser({ query: { _id: userID } });

      findOptions = { user: user._id };
    }

    const sessions = await findAllSessions({
      reqQuery: req.query,
      findOptions,
    });

    sendSuccess(res, { numResults: sessions.length, sessions });
  }
);

interface GetSessionOptions extends QueryOptions {
  fields?: string | string[];
}

// Get a specific session by sessionID or sessionID with userID
export const getSession = catchAsync(
  async (
    req: Request<GetSessionInput['params'], {}, {}, GetSessionOptions>,
    res: Response
  ) => {
    const { sessionID, userID } = req.params;
    const queryOptions = { ...req.query };

    if (env.dev || env.test) console.log(sessionID, userID, queryOptions);

    let query: object = { _id: sessionID };

    if (userID) {
      const user = await findUser({ query: { _id: userID } });

      query = { ...query, user: user._id };
    }

    const session = await findSession({ query, queryOptions });

    sendSuccess(res, { numResults: 1, session });
  }
);

// Create filter for deactivating and deleting all sessions
const ddAllSessionsFilter = async ({
  adminUser,
  targetUserID,
}: {
  adminUser: UserDocument;
  targetUserID?: string;
}) => {
  let filter: object = { user: { $ne: adminUser._id } };

  if (targetUserID) {
    const targetUser = await findUser({ query: { _id: targetUserID } });
    filter = { user: targetUser._id };
  }

  return filter;
};

// Deactivate all sessions except for admin
// Deactivate all sessions for one user (also for admin)
export const deactivateAllSessions = catchAsync(
  async (req: Request<GetAllSessionsInput['params']>, res: Response) => {
    const { user } = res.locals; // admin user
    const { userID } = req.params;

    const { modifiedCount, matchedCount } = await updateAllSessions({
      filter: await ddAllSessionsFilter({
        adminUser: user,
        targetUserID: userID,
      }),
      update: { valid: false },
    });

    sendSuccess(res, { modifiedCount, matchedCount });
  }
);

// Delete all sessions except for admin
// Delete all sessions for one user (also for admin)
export const deleteAllSessions = catchAsync(
  async (req: Request<GetAllSessionsInput['params']>, res: Response) => {
    const { user } = res.locals; // admin user
    const { userID } = req.params;

    await findAndDeleteAllSessions({
      filter: await ddAllSessionsFilter({
        adminUser: user,
        targetUserID: userID,
      }),
    });

    sendSuccess(res, { statusCode: 204 });
  }
);

// Only uses sessionID
export const deactivateSession = catchAsync(
  async (req: Request<GetSessionInput['params']>, res: Response) => {
    const { sessionID } = req.params;

    const session = await findAndUpdateSession({
      sessionID,
      update: { valid: false },
      options: { new: true, runValidators: true },
    });

    sendSuccess(res, { numResults: session ? 1 : 0, session });
  }
);

// Only uses sessionID
export const deleteSession = catchAsync(
  async (req: Request<GetSessionInput['params']>, res: Response) => {
    const { sessionID } = req.params;

    await findAndDeleteSession({ sessionID });

    sendSuccess(res, { statusCode: 204 });
  }
);
