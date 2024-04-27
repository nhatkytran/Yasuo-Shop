import { CookieOptions, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from 'config';

const publicKey = config.get<string>('publicKey');
const privateKey = config.get<string>('privateKey');
const accessTokenTtl = config.get<string>('accessTokenTtl');
const refreshTokenTtl = config.get<string>('refreshTokenTtl');
const accessTokenCookieTtl = config.get<number>('accessTokenCookieTtl');
const refreshTokenCookieTtl = config.get<number>('refreshTokenCookieTtl');

type SignJWTFactoryInput = { expiresIn: string };

type SignJWTInput = {
  userID: mongoose.Schema.Types.ObjectId;
  sessionID: mongoose.Schema.Types.ObjectId;
};

const signJWTFactory =
  ({ expiresIn }: SignJWTFactoryInput) =>
  ({ userID, sessionID }: SignJWTInput): string => {
    const payload = { userID, sessionID };
    const options: SignOptions = { expiresIn, algorithm: 'RS256' };

    return jwt.sign(payload, privateKey, options);
  };

export const signAccessJWT = signJWTFactory({ expiresIn: accessTokenTtl });
export const signRefreshJWT = signJWTFactory({ expiresIn: refreshTokenTtl });

type SendJWTCookieFactoryInput = {
  tokenName: 'accessToken' | 'refreshToken';
  maxAge: number;
};

const sendJWTCookieFactory =
  ({ tokenName, maxAge }: SendJWTCookieFactoryInput) =>
  (req: Request, res: Response, token: string, options: CookieOptions = {}) =>
    res.cookie(tokenName, token, {
      maxAge,
      httpOnly: true, // prevent accessing cookie from client side (Cross-site scripting - XSS)
      sameSite: 'strict', // Prevent CSRF attacks
      // headers['x-forwarded-proto'] set by proxy to indicate http(s) of the original node
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      ...options,
    });

export const sendAccessJWTCookie = sendJWTCookieFactory({
  tokenName: 'accessToken',
  maxAge: accessTokenCookieTtl,
});

export const sendRefreshJWTCookie = sendJWTCookieFactory({
  tokenName: 'refreshToken',
  maxAge: refreshTokenCookieTtl,
});

interface Decoded extends JwtPayload {
  userID: mongoose.Schema.Types.ObjectId;
  sessionID: mongoose.Schema.Types.ObjectId;
}

type VerifyJWTResult = {
  expired: boolean;
  decoded: Decoded | null;
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);

    return { expired: false, decoded } as VerifyJWTResult;
  } catch (error: any) {
    const isExpired = error.name === 'TokenExpiredError';

    return { expired: isExpired, decoded: null } as VerifyJWTResult;
  }
};
