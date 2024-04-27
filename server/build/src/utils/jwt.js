"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.sendRefreshJWTCookie = exports.sendAccessJWTCookie = exports.signRefreshJWT = exports.signAccessJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const publicKey = config_1.default.get('publicKey');
const privateKey = config_1.default.get('privateKey');
const accessTokenTtl = config_1.default.get('accessTokenTtl');
const refreshTokenTtl = config_1.default.get('refreshTokenTtl');
const accessTokenCookieTtl = config_1.default.get('accessTokenCookieTtl');
const refreshTokenCookieTtl = config_1.default.get('refreshTokenCookieTtl');
const signJWTFactory = ({ expiresIn }) => ({ userID, sessionID }) => {
    const payload = { userID, sessionID };
    const options = { expiresIn, algorithm: 'RS256' };
    return jsonwebtoken_1.default.sign(payload, privateKey, options);
};
exports.signAccessJWT = signJWTFactory({ expiresIn: accessTokenTtl });
exports.signRefreshJWT = signJWTFactory({ expiresIn: refreshTokenTtl });
const sendJWTCookieFactory = ({ tokenName, maxAge }) => (req, res, token, options = {}) => res.cookie(tokenName, token, Object.assign({ maxAge, httpOnly: true, sameSite: 'strict', 
    // headers['x-forwarded-proto'] set by proxy to indicate http(s) of the original node
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https' }, options));
exports.sendAccessJWTCookie = sendJWTCookieFactory({
    tokenName: 'accessToken',
    maxAge: accessTokenCookieTtl,
});
exports.sendRefreshJWTCookie = sendJWTCookieFactory({
    tokenName: 'refreshToken',
    maxAge: refreshTokenCookieTtl,
});
const verifyJWT = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return { expired: false, decoded };
    }
    catch (error) {
        const isExpired = error.name === 'TokenExpiredError';
        return { expired: isExpired, decoded: null };
    }
};
exports.verifyJWT = verifyJWT;
