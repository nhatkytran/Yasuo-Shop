import express from 'express';

import validate from '../middleware/validateResource';
import sessionRouter from './session.route';
import { protect } from '../controllers/session.controller';

import {
  activateSchema,
  emailSchema,
  resetPasswordSchema,
  signupUserSchema,
  updatePasswordSchema,
} from '../schemas/user.schema';

import {
  activate,
  forgotPassword,
  getActivateCode,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Handle sessions of one user: get, deactivate, delete,...
userRouter.use('/:userID/sessions', sessionRouter);

// Create user and activate user (confirm that email of user exists)

userRouter.post('/signup', validate(signupUserSchema), signup);

userRouter.get('/activateCode/:email', validate(emailSchema), getActivateCode);
userRouter.post('/activate', validate(activateSchema), activate);

// Passwords: forgot, reset, update

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

export default userRouter;
