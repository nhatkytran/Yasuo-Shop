import { NextFunction, Request, Response } from 'express';

import AppError from '../utils/appError';
import sendSuccess from '../utils/sendSuccess';
import catchAsync from '../utils/catchAsync';

import {
  sendAccessJWTCookie,
  sendRefreshJWTCookie,
  signAccessJWT,
  signRefreshJWT,
  verifyJWT,
} from '../utils/jwt';

import Session from '../models/sessions/session.model';
import User from '../models/users/user.model';
import { SigninUserInput } from '../schemas/session.schema';
import { findUser } from '../services/user.service';

import {
  checkAccessJWT,
  checkRefreshJWT,
  createSession,
  getJWTs,
  validatePassword,
} from '../services/session.service';

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
