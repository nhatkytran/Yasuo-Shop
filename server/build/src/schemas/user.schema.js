"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUserSchema = exports.updatePasswordSchema = exports.resetPasswordSchema = exports.activateSchema = exports.emailSchema = exports.signupUserSchema = exports.Email = exports.PasswordType = void 0;
const zod_1 = require("zod");
exports.PasswordType = (0, zod_1.string)()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/, 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character!');
exports.Email = { email: (0, zod_1.string)().email() };
const Code = { code: (0, zod_1.string)() };
// const UserID = { userID: string() };
const passwordNotMatchErrorOptions = {
    message: 'Passwords do not match!',
    path: ['passwordConfirm'],
};
exports.signupUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)(Object.assign(Object.assign({}, exports.Email), { name: (0, zod_1.string)(), password: exports.PasswordType, passwordConfirm: (0, zod_1.string)() })).refine(data => data.password === data.passwordConfirm, passwordNotMatchErrorOptions),
});
exports.emailSchema = (0, zod_1.object)({ params: (0, zod_1.object)(Object.assign({}, exports.Email)) });
exports.activateSchema = (0, zod_1.object)({ body: (0, zod_1.object)(Object.assign(Object.assign({}, exports.Email), Code)) });
exports.resetPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)(Object.assign(Object.assign(Object.assign({}, exports.Email), Code), { newPassword: exports.PasswordType })),
});
exports.updatePasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        currentPassword: exports.PasswordType,
        newPassword: exports.PasswordType,
        passwordConfirm: exports.PasswordType,
    }).refine(data => data.newPassword === data.passwordConfirm, passwordNotMatchErrorOptions),
});
exports.createNewUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)(Object.assign(Object.assign({}, exports.Email), { name: (0, zod_1.string)(), password: exports.PasswordType })),
});
