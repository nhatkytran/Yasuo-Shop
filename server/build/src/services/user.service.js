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
exports.identifyWhoDeleteUser = exports.updateUser = exports.changePassword = exports.resetUserPassword = exports.sendForgotPasswordTokenEmail = exports.createForgotPasswordToken = exports.activateUser = exports.sendActivateTokenEmail = exports.createActivateToken = exports.findUser = exports.findAllUsers = exports.sendCreateUserEmail = exports.createUser = exports.handleSendEmails = void 0;
const lodash_1 = require("lodash");
const appError_1 = __importDefault(require("../utils/appError"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const session_service_1 = require("./session.service");
const common_service_1 = require("./common.service");
const createActionToken = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, type, }) {
    let token;
    if (type === 'activate')
        token = user.createActivateToken();
    if (type === 'forgotPassword')
        token = user.createForgotPasswordToken();
    yield user.save({ validateBeforeSave: false });
    return token;
});
const handleSendEmails = (_b) => __awaiter(void 0, [_b], void 0, function* ({ user, token, sendMethod, field, errorMessage, }) {
    try {
        const email = new sendEmail_1.default(user);
        if (sendMethod === 'sendWelcome')
            yield email.sendWelcome({ oAuth: false, code: token });
        if (sendMethod === 'sendActivate' && token)
            yield email.sendActivate({ code: token });
        if (sendMethod === 'sendForgotPassword' && token)
            yield email.sendForgotPassword({ code: token });
    }
    catch (error) {
        if (field)
            yield user_model_1.default.updateOne({ _id: user._id }, { $unset: { [field]: 1 } });
        throw new appError_1.default({
            message: `Something went wrong sending email!${errorMessage ? ' ' : ''}${errorMessage || ''}`,
            statusCode: 500,
        });
    }
});
exports.handleSendEmails = handleSendEmails;
const createUser = (_c) => __awaiter(void 0, [_c], void 0, function* ({ input, isAdmin = false, }) {
    let createInput = input;
    if (!isAdmin) {
        const { name, email, password } = input; // Prevent user input -> active: true
        createInput = { name, email, password };
    }
    const user = yield user_model_1.default.create(createInput);
    let token = '';
    if (!isAdmin)
        token = yield createActionToken({ user, type: 'activate' });
    return {
        user: (0, lodash_1.omit)(user.toJSON(), 'password', 'ban'),
        token,
    };
});
exports.createUser = createUser;
const sendCreateUserEmail = (_d) => __awaiter(void 0, [_d], void 0, function* ({ user, token, }) {
    return yield (0, exports.handleSendEmails)({
        user,
        token,
        sendMethod: 'sendWelcome',
        field: 'activateToken',
        errorMessage: 'Please activate account manually.',
    });
});
exports.sendCreateUserEmail = sendCreateUserEmail;
const findAllUsers = (_e) => __awaiter(void 0, [_e], void 0, function* ({ reqQuery = {}, findOptions = {}, }) {
    const features = yield (0, apiFeatures_1.default)({ model: user_model_1.default, reqQuery, findOptions });
    features.filter().sort().project().paginate();
    return yield features.result();
});
exports.findAllUsers = findAllUsers;
const findUser = (_f) => __awaiter(void 0, [_f], void 0, function* ({ query, selectFields, }) {
    let mongooseQuery = user_model_1.default.findOne(query);
    if (selectFields)
        mongooseQuery = mongooseQuery.select(selectFields.map(field => `+${field}`).join(' '));
    const user = yield mongooseQuery;
    if (!user)
        throw new appError_1.default({ message: 'User not found!', statusCode: 404 });
    return user;
});
exports.findUser = findUser;
// Get activate code //////////
const createActivateToken = (_g) => __awaiter(void 0, [_g], void 0, function* ({ user, }) {
    (0, common_service_1.preventDeletedUser)(user.delete);
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventOAuthUser)(user.googleID);
    (0, common_service_1.preventActiveUser)(user.active);
    return yield createActionToken({ user, type: 'activate' });
});
exports.createActivateToken = createActivateToken;
const sendActivateTokenEmail = (_h) => __awaiter(void 0, [_h], void 0, function* ({ user, token, }) {
    return yield (0, exports.handleSendEmails)({
        user,
        token,
        sendMethod: 'sendActivate',
        field: 'activateToken',
    });
});
exports.sendActivateTokenEmail = sendActivateTokenEmail;
const activateUser = (_j) => __awaiter(void 0, [_j], void 0, function* ({ user, token }) {
    (0, common_service_1.preventDeletedUser)(user.delete);
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventOAuthUser)(user.googleID);
    (0, common_service_1.preventActiveUser)(user.active);
    (0, common_service_1.preventNotIssuedToken)({
        tokenField: user.activateToken,
        codeUrl: '/api/v1/users/activateCode/:email',
    });
    (0, common_service_1.preventInvalidToken)({ token, rawToken: user.activateToken });
    user.active = true;
    user.activateToken = undefined;
    yield user.save({ validateModifiedOnly: true });
});
exports.activateUser = activateUser;
// Forgot password code //////////
const createForgotPasswordToken = (_k) => __awaiter(void 0, [_k], void 0, function* ({ user, }) {
    (0, common_service_1.preventDeletedUser)(user.delete);
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventOAuthUser)(user.googleID);
    return yield createActionToken({ user, type: 'forgotPassword' });
});
exports.createForgotPasswordToken = createForgotPasswordToken;
const sendForgotPasswordTokenEmail = (_l) => __awaiter(void 0, [_l], void 0, function* ({ user, token, }) {
    return yield (0, exports.handleSendEmails)({
        user,
        token,
        sendMethod: 'sendForgotPassword',
        field: 'forgotPasswordToken',
    });
});
exports.sendForgotPasswordTokenEmail = sendForgotPasswordTokenEmail;
const resetUserPassword = (_m) => __awaiter(void 0, [_m], void 0, function* ({ user, token, newPassword, }) {
    (0, common_service_1.preventDeletedUser)(user.delete);
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventOAuthUser)(user.googleID);
    (0, common_service_1.preventNotIssuedToken)({
        tokenField: user.forgotPasswordToken,
        codeUrl: '/api/v1/users/forgotPassword/:email',
    });
    (0, common_service_1.preventInvalidToken)({ token, rawToken: user.forgotPasswordToken });
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    yield user.save({ validateModifiedOnly: true });
});
exports.resetUserPassword = resetUserPassword;
const changePassword = (_o) => __awaiter(void 0, [_o], void 0, function* ({ user, currentPassword, newPassword, }) {
    (0, common_service_1.preventDeletedUser)(user.delete);
    (0, common_service_1.preventBannedUser)(user.ban);
    (0, common_service_1.preventOAuthUser)(user.googleID);
    (0, common_service_1.preventInactiveUser)(user.active);
    if (!(yield user.comparePassword(currentPassword)))
        throw (0, session_service_1.unauthenticatedError)('Incorrect currentPassword!');
    if (currentPassword === newPassword)
        throw new appError_1.default({
            message: 'The new password is the same as the old one!',
            statusCode: 400,
        });
    user.password = newPassword;
    yield user.save({ validateModifiedOnly: true });
});
exports.changePassword = changePassword;
const updateUser = (_p) => __awaiter(void 0, [_p], void 0, function* ({ filter, update }) { return yield user_model_1.default.updateOne(filter, update); });
exports.updateUser = updateUser;
const identifyWhoDeleteUser = ({ whoUser, deletedUserEmail, }) => {
    if (whoUser.role === 'admin')
        return;
    if (whoUser.role === 'user' && whoUser.email !== deletedUserEmail)
        throw new appError_1.default({
            message: 'You can only delete your own account!',
            statusCode: 400,
        });
};
exports.identifyWhoDeleteUser = identifyWhoDeleteUser;
