import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';

import AppError from '../utils/appError';
import sendSuccess from '../utils/sendSuccess';
import catchAsync from '../utils/catchAsync';
import { SigninUserInput } from '../schemas/session.schema';

import {
  sendAccessJWTCookie,
  sendRefreshJWTCookie,
  signAccessJWT,
  signRefreshJWT,
  verifyJWT,
} from '../utils/jwt';

import { findUser } from '../services/user.service';
import { createSession, validatePassword } from '../services/session.service';
import Session from '../models/sessions/session.model';
import User from '../models/users/user.model';

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

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string =
      get(req, 'cookies.accessToken') ||
      get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

    const refreshToken: string =
      get(req, 'cookies.refreshToken') || get(req, 'headers.x-refresh');

    if (!accessToken && !refreshToken)
      throw new AppError({
        message: 'Please sign in to get access!',
        statusCode: 401,
      });

    if (accessToken) {
      const { expired, decoded } = verifyJWT(accessToken);

      if (decoded) {
        const { userID, sessionID } = decoded;

        const session = await Session.findById(sessionID);

        if (!session || !session.valid)
          throw new AppError({
            message: 'Please sign in to get access!',
            statusCode: 401,
          });

        const user = await User.findById(userID).select('+passwordChangedAt');

        if (!user)
          throw new AppError({
            message: 'The user belongs to this token does not longer exist!',
            statusCode: 401,
          });

        if (user.changedPassword(session.createdAt.getTime()))
          throw new AppError({
            message: 'User recently changed password! Please login again.',
            statusCode: 401,
          });

        res.locals.user = user;
        return next();
      }

      if (!decoded && !expired)
        throw new AppError({
          message: 'Invalid token! Please sign in again.',
          statusCode: 401,
        });

      if (!decoded && expired && !refreshToken)
        throw new AppError({
          message: 'Token has expired! Please login again.',
          statusCode: 401,
        });
    }

    const { expired, decoded } = verifyJWT(refreshToken);

    if (!decoded && !expired)
      throw new AppError({
        message: 'Invalid token! Please sign in again.',
        statusCode: 401,
      });

    if (!decoded && expired)
      throw new AppError({
        message: 'Token has expired! Please login again.',
        statusCode: 401,
      });

    if (decoded) {
      const { userID, sessionID } = decoded;

      const session = await Session.findById(sessionID);

      if (!session || !session.valid)
        throw new AppError({
          message: 'Please sign in to get access!',
          statusCode: 401,
        });

      const user = await User.findById(userID).select('+passwordChangedAt');

      if (!user)
        throw new AppError({
          message: 'The user belongs to this token does not longer exist!',
          statusCode: 401,
        });

      if (user.changedPassword(session.createdAt.getTime()))
        throw new AppError({
          message: 'User recently changed password! Please login again.',
          statusCode: 401,
        });

      const newAccessToken = signAccessJWT({
        userID: user._id,
        sessionID: session._id,
      });

      res.setHeader('x-access-token', newAccessToken);
      sendAccessJWTCookie(req, res, newAccessToken);

      res.locals.user = user;
    }

    next();
  }
);
