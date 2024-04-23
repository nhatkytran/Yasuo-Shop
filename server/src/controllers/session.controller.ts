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

import { UserInput } from '../models/users/schemaDefs';
import {
  GetAllSessionsInput,
  GetSessionInput,
  SigninUserInput,
} from '../schemas/session.schema';
import { findUser } from '../services/user.service';

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

// Authorization //////////

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = getJWTs(req);

    if (accessToken) {
      const user = await checkAccessJWT({
        accessToken,
        hasRefreshToken: Boolean(refreshToken),
      });

      if (user) {
        res.locals.user = user;
        return next();
      }
    }

    const { user, newAccessToken } = await checkRefreshJWT(refreshToken);

    res.setHeader('x-access-token', newAccessToken);
    sendAccessJWTCookie(req, res, newAccessToken);

    res.locals.user = user;
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

export const getSession = catchAsync(
  async (
    req: Request<GetSessionInput['params'], {}, {}, GetSessionOptions>,
    res: Response
  ) => {
    const { sessionID } = req.params;
    const queryOptions = { ...req.query };

    if (env.dev) console.log(sessionID, queryOptions);

    const session = await findSession({
      query: { _id: sessionID },
      queryOptions,
    });

    sendSuccess(res, { numResults: 1, session });
  }
);

export const deactivateAllSessions = catchAsync(
  async (req: Request<GetAllSessionsInput['params']>, res: Response) => {
    const { user } = res.locals; // admin user
    const { userID } = req.params;

    let filter: object = { user: { $ne: user._id } };

    if (userID) {
      const user = await findUser({ query: { _id: userID } }); // target user
      filter = { user: user._id };
    }

    const { modifiedCount, matchedCount } = await updateAllSessions({
      filter,
      update: { valid: false },
    });

    sendSuccess(res, { modifiedCount, matchedCount });
  }
);

export const deleteAllSessions = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = res.locals;

    await findAndDeleteAllSessions({ filter: { user: { $ne: user._id } } });

    sendSuccess(res, { statusCode: 204 });
  }
);

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

export const deleteSession = catchAsync(
  async (req: Request<GetSessionInput['params']>, res: Response) => {
    const { sessionID } = req.params;

    await findAndDeleteSession({ sessionID });

    sendSuccess(res, { statusCode: 204 });
  }
);