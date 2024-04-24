import express from 'express';

import validate from '../middleware/validateResource';
import sessionRouter from './session.route';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  activateSchema,
  emailSchema,
  resetPasswordSchema,
  signupUserSchema,
  updatePasswordSchema,
} from '../schemas/user.schema';

import {
  activate,
  createNewUser,
  forgotPassword,
  getActivateCode,
  getAllUsers,
  getMe,
  getUser,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Handle sessions of one user: get, deactivate, delete,...
userRouter.use('/:userID/sessions', sessionRouter);

// Create user and activate user (confirm that email of user exists) //////////

userRouter.post('/signup', validate(signupUserSchema), signup);

userRouter.get('/activateCode/:email', validate(emailSchema), getActivateCode);
userRouter.post('/activate', validate(activateSchema), activate);

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

// Ban user //////////

// ?userID=<id> || ?email=<email>
// userRouter.post('/banAccount', protect, restrictTo('admin'), banAccount);

// CRUD //////////

userRouter.get('/me', protect, getMe);

userRouter
  .route('/')
  .get(protect, restrictTo('admin'), getAllUsers)
  .post(protect, restrictTo('admin'), createNewUser);

userRouter.route('/:email').get(protect, restrictTo('admin'), getUser);

export default userRouter;
