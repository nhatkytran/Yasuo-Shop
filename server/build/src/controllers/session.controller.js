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
exports.deleteSession = exports.deactivateSession = exports.deleteAllSessions = exports.deactivateAllSessions = exports.getSession = exports.getAllSessions = exports.restrictTo = exports.protect = exports.signin = void 0;
const env_1 = __importDefault(require("../utils/env"));
const sendSuccess_1 = __importDefault(require("../utils/sendSuccess"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
const session_service_1 = require("../services/session.service");
// Authentication //////////
exports.signin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, user_service_1.findUser)({
        query: { email },
        selectFields: ['password'],
    });
    yield (0, session_service_1.validatePassword)({ user, password });
    const session = yield (0, session_service_1.createSession)({
        userID: user._id,
        userAgent: req.get('user-agent') || '',
    });
    const tokenOptions = { userID: user._id, sessionID: session._id };
    const accessToken = (0, jwt_1.signAccessJWT)(tokenOptions);
    const refreshToken = (0, jwt_1.signRefreshJWT)(tokenOptions);
    (0, jwt_1.sendAccessJWTCookie)(req, res, accessToken);
    (0, jwt_1.sendRefreshJWTCookie)(req, res, refreshToken);
    (0, sendSuccess_1.default)(res, { accessToken, refreshToken });
}));
// Authorization //////////
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = (0, session_service_1.getJWTs)(req);
    if (accessToken) {
        const user = yield (0, session_service_1.checkAccessJWT)({
            accessToken,
            hasRefreshToken: Boolean(refreshToken),
        });
        if (user) {
            (0, session_service_1.protectCheckUserState)(user);
            res.locals.user = user;
            return next();
        }
    }
    const { user, newAccessToken } = yield (0, session_service_1.checkRefreshJWT)(refreshToken);
    (0, session_service_1.protectCheckUserState)(user);
    res.locals.user = user;
    res.setHeader('x-access-token', newAccessToken);
    (0, jwt_1.sendAccessJWTCookie)(req, res, newAccessToken);
    next();
}));
const restrictTo = (...roles) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    (0, session_service_1.checkIsAuthorized)({ user, roles });
    next();
}));
exports.restrictTo = restrictTo;
// CRUD Sessions - only for admin //////////
// Get all sessions (also for one user)
exports.getAllSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    let findOptions = {};
    if (userID) {
        const user = yield (0, user_service_1.findUser)({ query: { _id: userID } });
        findOptions = { user: user._id };
    }
    const sessions = yield (0, session_service_1.findAllSessions)({
        reqQuery: req.query,
        findOptions,
    });
    (0, sendSuccess_1.default)(res, { numResults: sessions.length, sessions });
}));
// Get a specific session by sessionID or sessionID with userID
exports.getSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionID, userID } = req.params;
    const queryOptions = Object.assign({}, req.query);
    if (env_1.default.dev)
        console.log(sessionID, userID, queryOptions);
    let query = { _id: sessionID };
    if (userID) {
        const user = yield (0, user_service_1.findUser)({ query: { _id: userID } });
        query = Object.assign(Object.assign({}, query), { user: user._id });
    }
    const session = yield (0, session_service_1.findSession)({ query, queryOptions });
    (0, sendSuccess_1.default)(res, { numResults: 1, session });
}));
// Create filter for deactivating and deleting all sessions
const ddAllSessionsFilter = (_a) => __awaiter(void 0, [_a], void 0, function* ({ adminUser, targetUserID, }) {
    let filter = { user: { $ne: adminUser._id } };
    if (targetUserID) {
        const targetUser = yield (0, user_service_1.findUser)({ query: { _id: targetUserID } });
        filter = { user: targetUser._id };
    }
    return filter;
});
// Deactivate all sessions except for admin
// Deactivate all sessions for one user (also for admin)
exports.deactivateAllSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals; // admin user
    const { userID } = req.params;
    const { modifiedCount, matchedCount } = yield (0, session_service_1.updateAllSessions)({
        filter: yield ddAllSessionsFilter({
            adminUser: user,
            targetUserID: userID,
        }),
        update: { valid: false },
    });
    (0, sendSuccess_1.default)(res, { modifiedCount, matchedCount });
}));
// Delete all sessions except for admin
// Delete all sessions for one user (also for admin)
exports.deleteAllSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals; // admin user
    const { userID } = req.params;
    yield (0, session_service_1.findAndDeleteAllSessions)({
        filter: yield ddAllSessionsFilter({
            adminUser: user,
            targetUserID: userID,
        }),
    });
    (0, sendSuccess_1.default)(res, { statusCode: 204 });
}));
// Only uses sessionID
exports.deactivateSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionID } = req.params;
    const session = yield (0, session_service_1.findAndUpdateSession)({
        sessionID,
        update: { valid: false },
        options: { new: true, runValidators: true },
    });
    (0, sendSuccess_1.default)(res, { numResults: session ? 1 : 0, session });
}));
// Only uses sessionID
exports.deleteSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionID } = req.params;
    yield (0, session_service_1.findAndDeleteSession)({ sessionID });
    (0, sendSuccess_1.default)(res, { statusCode: 204 });
}));
