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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const tokenAndHash_1 = require("../../utils/tokenAndHash");
const schemaDefs_1 = require("./schemaDefs");
const commonDefs_1 = require("../commonDefs");
const schema = new mongoose_1.default.Schema(schemaDefs_1.schemaDefs, commonDefs_1.schemaSups);
// Middlewares //////////
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified('password'))
            return next();
        user.password = yield bcrypt_1.default.hash(user.password, config_1.default.get('bcryptSaltFactor'));
        if (!this.isNew)
            user.passwordChangedAt = new Date();
        next();
    });
});
// ts ignore for this keyword -> this points to user document
// this function will be a schema method
const createTokenFactory = ({ field, timeoutMinute }) => function () {
    const { token, hash } = (0, tokenAndHash_1.createTokens)({ timeoutMinute });
    // @ts-ignore
    this[field] = hash;
    return token;
};
schema.methods.createActivateToken = createTokenFactory({
    field: 'activateToken',
    timeoutMinute: 2,
});
schema.methods.createForgotPasswordToken = createTokenFactory({
    field: 'forgotPasswordToken',
    timeoutMinute: 2,
});
schema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
schema.methods.changedPassword = function (loginTimestamp) {
    if (!this.passwordChangedAt)
        return false;
    return loginTimestamp < this.passwordChangedAt.getTime();
};
const User = mongoose_1.default.model('User', schema, 'users');
exports.default = User;
