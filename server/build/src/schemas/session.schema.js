"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionSchema = exports.getAllSessionsSchema = exports.signinUserSchema = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("./user.schema");
const SessionID = {
    sessionID: (0, zod_1.string)({ required_error: `Session's ID is required!` }),
};
const OptionalUserID = { userID: (0, zod_1.string)().optional() };
const paramsOptionalUserID = { params: (0, zod_1.object)(Object.assign({}, OptionalUserID)) };
exports.signinUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)(Object.assign(Object.assign({}, user_schema_1.Email), { password: user_schema_1.PasswordType })),
});
exports.getAllSessionsSchema = (0, zod_1.object)(Object.assign({}, paramsOptionalUserID));
exports.getSessionSchema = (0, zod_1.object)({
    params: (0, zod_1.object)(Object.assign(Object.assign({}, SessionID), OptionalUserID)),
});
