"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndDeleteSession = exports.findAndUpdateSession = exports.findAndDeleteAllSessions = exports.updateAllSessions = exports.checkIsAuthorized = exports.checkRefreshJWT = exports.checkAccessJWT = exports.getJWTs = exports.protectCheckUserState = exports.findSession = exports.findAllSessions = exports.createSession = exports.validatePassword = exports.unauthenticatedError = void 0;
const lodash_1 = require("lodash");
const appError_1 = __importDefault(require("../utils/appError"));
const jwt_1 = require("../utils/jwt");
const session_model_1 = __importDefault(require("../models/sessions/session.model"));
const user_service_1 = require("./user.service");
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const common_service_1 = require("./common.service");
const unauthenticatedError = (message) => new appError_1.default({
    message,
    statusCode: 401,
});
exports.unauthenticatedError = unauthenticatedError;
const validatePassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, password, }) {
    (0, common_service_1.preventDeletedUser)(user.delete);
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventOAuthUser)(user.googleID);
    (0, common_service_1.preventInactiveUser)(user.active);
    if (!(yield user.comparePassword(password)))
        throw (0, exports.unauthenticatedError)('Incorrect password!');
});
exports.validatePassword = validatePassword;
const createSession = (_b) => __awaiter(void 0, [_b], void 0, function* ({ userID, userAgent, }) {
    const session = yield session_model_1.default.create({ user: userID, userAgent });
    return session;
});
exports.createSession = createSession;
const findAllSessions = (_c) => __awaiter(void 0, [_c], void 0, function* ({ reqQuery = {}, findOptions = {}, }) {
    const features = yield (0, apiFeatures_1.default)({ model: session_model_1.default, reqQuery, findOptions });
    features.filter().sort().project().paginate();
    return yield features.result();
});
exports.findAllSessions = findAllSessions;
const findSession = (_d) => __awaiter(void 0, [_d], void 0, function* ({ query, queryOptions = {}, }) {
    let mongooseQuery = session_model_1.default.findOne(query);
    let { fields } = queryOptions;
    let selectOptions = {};
    if (fields) {
        if (!Array.isArray(fields))
            fields = fields.split(',');
        fields.forEach(field => (selectOptions[field] = true));
        mongooseQuery = mongooseQuery.select(fields);
    }
    const session = yield mongooseQuery;
    if (!session)
        throw new appError_1.default({ message: 'Session not found!', statusCode: 404 });
    return session;
});
exports.findSession = findSession;
// Get jwts from headers and cookies //////////
// active check by signin -> only active is true can sign jwts
const protectCheckUserState = (user) => {
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventDeletedUser)(user.delete);
};
exports.protectCheckUserState = protectCheckUserState;
const getJWTs = (req) => {
    const accessToken = (0, lodash_1.get)(req, 'headers.authorization', '').replace(/^Bearer\s/, '') ||
        (0, lodash_1.get)(req, 'cookies.accessToken');
    const refreshToken = (0, lodash_1.get)(req, 'headers.x-refresh') || (0, lodash_1.get)(req, 'cookies.refreshToken');
    if (!accessToken && !refreshToken)
        throw (0, exports.unauthenticatedError)('Please sign in to get access!');
    return { accessToken, refreshToken };
};
exports.getJWTs = getJWTs;
// protect helpers //////////
const checkSession = (sessionID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield (0, exports.findSession)({ query: { _id: sessionID } });
        if (!session.valid)
            throw new Error();
        return session;
    }
    catch (error) {
        throw (0, exports.unauthenticatedError)('Invalid session! Please sign in to get access.');
    }
});
const checkUser = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.findUser)({
            query: { _id: userID },
            selectFields: ['passwordChangedAt'],
        });
        return user;
    }
    catch (error) {
        throw (0, exports.unauthenticatedError)('The user belongs to this token does not longer exist!');
    }
});
const preventOldJWTs = (user, session) => {
    if (user.changedPassword(session.createdAt.getTime()))
        throw (0, exports.unauthenticatedError)('User recently changed password! Please login again.');
};
const checkAccessJWT = (_e) => __awaiter(void 0, [_e], void 0, function* ({ accessToken, hasRefreshToken, }) {
    const { expired, decoded } = (0, jwt_1.verifyJWT)(accessToken);
    if (decoded) {
        const { userID, sessionID } = decoded;
        const session = yield checkSession(sessionID);
        const user = yield checkUser(userID);
        preventOldJWTs(user, session);
        return user;
    }
    if (!expired)
        throw (0, exports.unauthenticatedError)('Invalid token! Please sign in again.');
    if (expired && !hasRefreshToken)
        throw (0, exports.unauthenticatedError)('Token has expired! Please login again.');
    return null; // Invalid accessToken, but still has refreshToken
});
exports.checkAccessJWT = checkAccessJWT;
// Verify and handle errors for refreshToken //////////
const checkRefreshJWT = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken)
        throw (0, exports.unauthenticatedError)('Please sign in to get access.');
    const { expired, decoded } = (0, jwt_1.verifyJWT)(refreshToken);
    if (decoded) {
        const { userID, sessionID } = decoded;
        const session = yield checkSession(sessionID);
        const user = yield checkUser(userID);
        preventOldJWTs(user, session);
        const newAccessToken = (0, jwt_1.signAccessJWT)({
            userID: user._id,
            sessionID: session._id,
        });
        return { user, newAccessToken };
    }
    if (expired)
        throw (0, exports.unauthenticatedError)('Token has expired! Please login again.');
    throw (0, exports.unauthenticatedError)('Invalid token! Please sign in again.');
});
exports.checkRefreshJWT = checkRefreshJWT;
const checkIsAuthorized = ({ user, roles, }) => {
    if (!user)
        throw (0, exports.unauthenticatedError)('Please sign in to get access.');
    if (!roles.includes(user.role))
        throw new appError_1.default({
            message: "You don't have permission to perform this action!",
            statusCode: 403,
        });
};
exports.checkIsAuthorized = checkIsAuthorized;
const updateAllSessions = (_f) => __awaiter(void 0, [_f], void 0, function* ({ filter, update, }) {
    const { modifiedCount, matchedCount } = yield session_model_1.default.updateMany(filter, update);
    return { modifiedCount, matchedCount };
});
exports.updateAllSessions = updateAllSessions;
// Delete all sesions //////////
const findAndDeleteAllSessions = (_g) => __awaiter(void 0, [_g], void 0, function* ({ filter, }) { return yield session_model_1.default.deleteMany(filter); });
exports.findAndDeleteAllSessions = findAndDeleteAllSessions;
const findAndUpdateSession = (_h) => __awaiter(void 0, [_h], void 0, function* ({ sessionID, update, options, }) {
    const session = yield session_model_1.default.findByIdAndUpdate(sessionID, update, options);
    if (!session)
        return null;
    return session;
});
exports.findAndUpdateSession = findAndUpdateSession;
// Delete session by id //////////
const findAndDeleteSession = (_j) => __awaiter(void 0, [_j], void 0, function* ({ sessionID, }) { return yield session_model_1.default.findByIdAndDelete(sessionID); });
exports.findAndDeleteSession = findAndDeleteSession;
