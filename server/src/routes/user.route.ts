import express from 'express';

import validate from '../middleware/validateResource';
import sessionRouter from './session.route';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  activateSchema,
  createNewUserSchema,
  emailSchema,
  resetPasswordSchema,
  signupUserSchema,
  updatePasswordSchema,
} from '../schemas/user.schema';

import {
  activate,
  adminRestoreUser,
  checkWhoDeleteUser,
  createNewUser,
  deleteUser,
  forgotPassword,
  getActivateCode,
  getAllUsers,
  getMe,
  getRestoreCode,
  getUser,
  resetPassword,
  signup,
  updatePassword,
  userRestoreUser,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Handle sessions of one user: get, deactivate, delete,...
userRouter.use('/:userID/sessions', sessionRouter);

// Create user and activate user (confirm that email of user exists) //////////

userRouter.post('/signup', validate(signupUserSchema), signup);

userRouter.get('/activateCode/:email', validate(emailSchema), getActivateCode);
userRouter.patch('/activate', validate(activateSchema), activate);

// Passwords: forgot, reset, update //////////

userRouter.get('/forgotPassword/:email', validate(emailSchema), forgotPassword);

userRouter.patch(
  '/resetPassword',
  validate(resetPasswordSchema),
  resetPassword
);

userRouter.patch(
  '/updatePassword',
  protect,
  validate(updatePasswordSchema),
  updatePassword
);

// Restore deleted user, ban user //////////

// admin can restore any user
userRouter.patch(
  '/adminRestore/:email',
  protect,
  restrictTo('admin'),
  validate(emailSchema),
  adminRestoreUser
);

// user restore their own account and that account was not be deleted by admin
userRouter.get(
  '/userRestoreCode/:email',
  validate(emailSchema),
  getRestoreCode
);

userRouter.patch('/userRestore', validate(activateSchema), userRestoreUser);

// Ban user //////////

// ?userID=<id> || ?email=<email>
// userRouter.post('/banAccount', protect, restrictTo('admin'), banAccount);

// CRUD //////////

userRouter.get('/me', protect, getMe);

userRouter
  .route('/')
  .get(protect, restrictTo('admin'), getAllUsers)
  .post(
    protect,
    restrictTo('admin'),
    validate(createNewUserSchema),
    createNewUser
  );

userRouter
  .route('/:email')
  .get(protect, restrictTo('admin'), validate(emailSchema), getUser)
  // admin can delete any user
  // user can only delete their own account
  // delete does not delete user, actually it just mark user as a deleted one
  .delete(protect, checkWhoDeleteUser, validate(emailSchema), deleteUser);

// upload photo -> using AWS -> User image uploader in Jonas React course
// update user's name

export default userRouter;
