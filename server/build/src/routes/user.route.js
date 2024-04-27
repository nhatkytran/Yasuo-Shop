"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const session_route_1 = __importDefault(require("./session.route"));
const session_controller_1 = require("../controllers/session.controller");
const user_schema_1 = require("../schemas/user.schema");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
// Handle sessions of one user: get, deactivate, delete,...
userRouter.use('/:userID/sessions', session_route_1.default);
// Create user and activate user (confirm that email of user exists) //////////
userRouter.post('/signup', (0, validateResource_1.default)(user_schema_1.signupUserSchema), user_controller_1.signup);
userRouter.get('/activateCode/:email', (0, validateResource_1.default)(user_schema_1.emailSchema), user_controller_1.getActivateCode);
userRouter.patch('/activate', (0, validateResource_1.default)(user_schema_1.activateSchema), user_controller_1.activate);
// Passwords: forgot, reset, update //////////
userRouter.get('/forgotPassword/:email', (0, validateResource_1.default)(user_schema_1.emailSchema), user_controller_1.forgotPassword);
userRouter.patch('/resetPassword', (0, validateResource_1.default)(user_schema_1.resetPasswordSchema), user_controller_1.resetPassword);
userRouter.patch('/updatePassword', session_controller_1.protect, (0, validateResource_1.default)(user_schema_1.updatePasswordSchema), user_controller_1.updatePassword);
// Restore deleted user, ban user //////////
// admin can restore any user
userRouter.patch('/adminRestore/:email', session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), (0, validateResource_1.default)(user_schema_1.emailSchema), user_controller_1.adminRestoreUser);
// user can only restore their own account and that account was not be deleted by admin
userRouter.get('/userRestoreCode/:email', (0, validateResource_1.default)(user_schema_1.emailSchema), user_controller_1.getRestoreCode);
// userRouter.patch('/restore/:email', userRestoreUser);
// Ban user //////////
// ?userID=<id> || ?email=<email>
// userRouter.post('/banAccount', protect, restrictTo('admin'), banAccount);
// CRUD //////////
userRouter.get('/me', session_controller_1.protect, user_controller_1.getMe);
userRouter
    .route('/')
    .get(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), user_controller_1.getAllUsers)
    .post(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), (0, validateResource_1.default)(user_schema_1.createNewUserSchema), user_controller_1.createNewUser);
userRouter
    .route('/:email')
    .get(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'), (0, validateResource_1.default)(user_schema_1.emailSchema), user_controller_1.getUser)
    // admin can delete any user
    // user can only delete their own account
    // delete does not delete user, actually it just mark user as a deleted one
    .delete(session_controller_1.protect, user_controller_1.checkWhoDeleteUser, (0, validateResource_1.default)(user_schema_1.emailSchema), user_controller_1.deleteUser);
// upload photo -> using AWS -> User image uploader in Jonas React course
// update user's name
exports.default = userRouter;
