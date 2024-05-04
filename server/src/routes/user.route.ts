import express from 'express';

import sessionRouter from './session.route';
import purchaseRouter from './purchase.route';
import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  activateSchema,
  bannedSchema,
  createNewUserSchema,
  emailSchema,
  resetPasswordSchema,
  signupUserSchema,
  updatePasswordSchema,
} from '../schemas/user.schema';

import {
  activate,
  adminRestoreUser,
  banAccount,
  checkWhoDeleteUser,
  createNewUser,
  deleteUser,
  forgotPassword,
  getActivateCode,
  getAllUsers,
  getMe,
  getRestoreCode,
  getS3SignedUrl,
  getUser,
  resetPassword,
  signup,
  updateMe,
  updatePassword,
  userRestoreUser,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Handle sessions of one user: get, deactivate, delete,...
userRouter.use('/:userID/sessions', sessionRouter);

// Get, Delete,... all purchases of user
userRouter.use('/:userID/purchases', purchaseRouter);

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

// Admin ban user using email //////////

userRouter.post(
  '/banAccount',
  protect,
  restrictTo('admin'),
  validate(bannedSchema),
  banAccount
);

// Upload photo AWS S3 and U - Update user's name and photo //////////

// new only admin can access this route because I use AWS S3 for uploading photo
// and it can charge me money
userRouter.get('/uploadPhotoUrl', protect, restrictTo('admin'), getS3SignedUrl);

// CRD //////////

userRouter.route('/me').get(protect, getMe).patch(protect, updateMe);

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

export default userRouter;
