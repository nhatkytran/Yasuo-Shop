import { CookieOptions, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';

const publicKey = config.get<string>('publicKey');
const privateKey = config.get<string>('privateKey');
const accessTokenTtl = config.get<string>('accessTokenTtl');
const refreshTokenTtl = config.get<string>('refreshTokenTtl');

type SignJWTFactoryInput = { expiresIn: string };

type SignJWTInput = {
  userID: mongoose.Schema.Types.ObjectId;
  sessionID: mongoose.Schema.Types.ObjectId;
};

const signJWTFactory =
  ({ expiresIn }: SignJWTFactoryInput) =>
  ({ userID, sessionID }: SignJWTInput): string => {
    const payload = { userID, sessionID };
    const options: jwt.SignOptions = { expiresIn, algorithm: 'RS256' };

    return jwt.sign(payload, privateKey, options);
  };

export const signAccessJWT = signJWTFactory({ expiresIn: accessTokenTtl });
export const signRefreshJWT = signJWTFactory({ expiresIn: refreshTokenTtl });

type SendJWTCookieFactoryInput = { tokenName: 'accessToken' | 'refreshToken' };

const sendJWTCookieFactory =
  ({ tokenName }: SendJWTCookieFactoryInput) =>
  (req: Request, res: Response, token: string, options: CookieOptions = {}) =>
    res.cookie(tokenName, token, {
      maxAge: 900000,
      httpOnly: true, // prevent accessing cookie from client side (Cross-site scripting - XSS)
      sameSite: 'strict',
      // headers['x-forwarded-proto'] set by proxy to indicate http(s) of the original node
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      ...options,
    });

export const sendAccessJWTCookie = sendJWTCookieFactory({
  tokenName: 'accessToken',
});

export const sendRefreshJWTCookie = sendJWTCookieFactory({
  tokenName: 'refreshToken',
});

export const verifyJWT = () => {};
