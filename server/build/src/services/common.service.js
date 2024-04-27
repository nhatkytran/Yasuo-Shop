"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventInactiveUser = exports.preventActiveUser = exports.preventBannedUser = exports.preventDeletedUser = exports.preventOAuthUser = exports.preventInvalidToken = exports.preventNotIssuedToken = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const tokenAndHash_1 = require("../utils/tokenAndHash");
const session_service_1 = require("./session.service");
// Throw error when user have not issue token yet
const preventNotIssuedToken = ({ tokenField, codeUrl, }) => {
    if (!tokenField)
        throw new appError_1.default({
            message: `Get your verification code first at ${codeUrl}`,
            statusCode: 401,
        });
};
exports.preventNotIssuedToken = preventNotIssuedToken;
// Throw error when token is invaid
const preventInvalidToken = ({ token, rawToken, }) => {
    const [hash, timeout] = rawToken.split('/');
    if ((0, tokenAndHash_1.hashToken)(token) !== hash || Date.now() > Number(timeout))
        throw new appError_1.default({
            message: 'Invalid token or token has expired!',
            statusCode: 401,
        });
};
exports.preventInvalidToken = preventInvalidToken;
// Throw error when user created by OAuth: google,...
const preventOAuthUser = (oAuth) => {
    if (Boolean(oAuth))
        throw new appError_1.default({
            message: 'This feature only supports accounts created manually!',
            statusCode: 403,
        });
};
exports.preventOAuthUser = preventOAuthUser;
// Throw error when deleted user performs action
const preventDeletedUser = (deleteObj) => {
    if (!deleteObj || !(deleteObj === null || deleteObj === void 0 ? void 0 : deleteObj.deleteAt))
        return;
    const date = deleteObj.deleteAt
        .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })
        .replace(',', '');
    const message = deleteObj.byAdmin
        ? `Your account has been deleted by admin on ${date}! Please contact admin via nhockkutean2@gmail.com for more information`
        : `Your account has been deleted on ${date}! Restore your account at /api/v1/users/restore/:email'`;
    throw new appError_1.default({ message, statusCode: 403 });
};
exports.preventDeletedUser = preventDeletedUser;
// Throw error when banned user performs action
const preventBannedUser = (isBanned) => {
    if (Boolean(isBanned))
        throw new appError_1.default({
            message: 'Your account has been banned! Please contact admin via nhockkutean2@gmail.com for more information.',
            statusCode: 403,
        });
};
exports.preventBannedUser = preventBannedUser;
// Throw error when user is already active
const preventActiveUser = (active) => {
    if (Boolean(active))
        throw new appError_1.default({
            message: 'User is already active!',
            statusCode: 400,
        });
};
exports.preventActiveUser = preventActiveUser;
// Throw error when inactive user
const preventInactiveUser = (active) => {
    if (!Boolean(active))
        throw (0, session_service_1.unauthenticatedError)('First you need to activate you account at /api/v1/users/activateCode/:email');
};
exports.preventInactiveUser = preventInactiveUser;
