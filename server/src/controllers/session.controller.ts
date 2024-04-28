import { NextFunction, Request, Response } from 'express';
import { QueryOptions } from 'mongoose';

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
  SigninUserInput,
} from '../schemas/session.schema';

import {
  checkAccessJWT,
  checkIsAuthorized,
  checkRefreshJWT,
  createSession,
  findAllSessions,
  findAndDeleteAllSessions,
  findAndDeleteSession,
  findAndUpdateSession,
  findSession,
  getJWTs,
  protectCheckUserState,
  updateAllSessions,
  validatePassword,
} from '../services/session.service';

// Authentication //////////

export const signin = catchAsync(
  async (req: Request<{}, {}, SigninUserInput['body']>, res: Response) => {
    const { email, password } = req.body;

    const user = await findUser({
      query: { email },
      selectFields: ['password'],
    });

    await validatePassword({ user, password });

    const session = await createSession({
      userID: user._id,
      userAgent: req.get('user-agent') || '',
    });

    const tokenOptions = { userID: user._id, sessionID: session._id };
    const accessToken = signAccessJWT(tokenOptions);
    const refreshToken = signRefreshJWT(tokenOptions);

    sendAccessJWTCookie(req, res, accessToken);
    sendRefreshJWTCookie(req, res, refreshToken);

    sendSuccess(res, { accessToken, refreshToken });
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

    if (env.dev) console.log(sessionID, userID, queryOptions);

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
