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
exports.userRestoreUser = exports.getRestoreCode = exports.adminRestoreUser = exports.deleteUser = exports.checkWhoDeleteUser = exports.createNewUser = exports.getUser = exports.getAllUsers = exports.getMe = exports.banAccount = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.activate = exports.getActivateCode = exports.signup = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendSuccess_1 = __importDefault(require("../utils/sendSuccess"));
const env_1 = __importDefault(require("../utils/env"));
const user_service_1 = require("../services/user.service");
// Sign up //////////
exports.signup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, token } = yield (0, user_service_1.createUser)({ input: req.body });
    if (env_1.default.prod)
        yield (0, user_service_1.sendCreateUserEmail)({ user, token });
    (0, sendSuccess_1.default)(res, {
        statusCode: 201,
        message: 'Sign up successfully. Your activate code is sent to your email! Please check.',
        user,
    });
}));
// Activate user -> active: true //////////
exports.getActivateCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const user = yield (0, user_service_1.findUser)({ query: { email } });
    const token = yield (0, user_service_1.createActivateToken)({ user });
    yield (0, user_service_1.sendActivateTokenEmail)({ user, token });
    (0, sendSuccess_1.default)(res, {
        message: 'Activate code has been sent to your email. Please check.',
    });
}));
exports.activate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    const user = yield (0, user_service_1.findUser)({
        query: { email },
        selectFields: ['activateToken'],
    });
    yield (0, user_service_1.activateUser)({ user, token: code });
    (0, sendSuccess_1.default)(res, { message: 'Activate account successfully.' });
}));
// Passwords //////////
exports.forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.findUser)({ query: { email: req.params.email } });
    const token = yield (0, user_service_1.createForgotPasswordToken)({ user });
    yield (0, user_service_1.sendForgotPasswordTokenEmail)({ user, token });
    (0, sendSuccess_1.default)(res, {
        message: 'Forgot password code has been sent to your email. Please check.',
    });
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, newPassword } = req.body;
    const user = yield (0, user_service_1.findUser)({
        query: { email },
        selectFields: ['forgotPasswordToken'],
    });
    yield (0, user_service_1.resetUserPassword)({ user, token: code, newPassword });
    (0, sendSuccess_1.default)(res, { message: 'Reset password successfully.' });
}));
exports.updatePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const user = yield (0, user_service_1.findUser)({
        query: { _id: res.locals.user._id },
        selectFields: ['password'],
    });
    yield (0, user_service_1.changePassword)({ user, currentPassword, newPassword });
    (0, sendSuccess_1.default)(res, { message: 'Update password successfully!' });
}));
// Ban user -> ?userID=<id> || ?email=<email> //////////
exports.banAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID, email } = req.query;
}));
// CRUD //////////
exports.getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, sendSuccess_1.default)(res, { user: res.locals.user }); }));
exports.getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, user_service_1.findAllUsers)({ reqQuery: req.query });
    (0, sendSuccess_1.default)(res, { numResults: users.length, users });
}));
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.findUser)({
        query: { email: req.params.email },
        selectFields: [
            'password',
            'googleID',
            'activateToken',
            'forgotPasswordToken',
            'passwordChangedAt',
            'restoreToken',
        ],
    });
    (0, sendSuccess_1.default)(res, { numResults: 1, user });
}));
exports.createNewUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = yield (0, user_service_1.createUser)({ input: req.body, isAdmin: true });
    (0, sendSuccess_1.default)(res, {
        statusCode: 201,
        message: 'Create user successfully.',
        user,
    });
}));
exports.checkWhoDeleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { email } = req.params;
    (0, user_service_1.identifyWhoDeleteUser)({ whoUser: user, deletedUserEmail: email });
    next();
}));
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    const { email } = req.params;
    yield (0, user_service_1.updateUser)({
        filter: { email },
        update: {
            delete: { byAdmin: user.role === 'admin', deleteAt: new Date() },
        },
    });
    (0, sendSuccess_1.default)(res, { statusCode: 204 });
}));
// admin can restore any user
exports.adminRestoreUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_service_1.updateUser)({
        filter: { email: req.params.email },
        update: { $unset: { delete: 1 } },
    });
    (0, sendSuccess_1.default)(res, { message: 'Restore user successfully.' });
}));
// user can only restore their own account and that account was not be deleted by admin
exports.getRestoreCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const user = yield (0, user_service_1.findUser)({ query: { email } });
    console.log(user);
    // const token = await createAcToken({ user });
    // await sendActivateTokenEmail({ user, token });
    (0, sendSuccess_1.default)(res, {
        message: 'Restore code has been sent to your email. Please check.',
    });
}));
exports.userRestoreUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello World!');
}));
