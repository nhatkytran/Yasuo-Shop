import express from 'express';

import validate from '../middleware/validateResource';

import {
  activateSchema,
  emailSchema,
  signupUserSchema,
} from '../schemas/user.schema';

import {
  activate,
  forgotPassword,
  getActivateCode,
  signup,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Create user and activate user (confirm that email of user exists)

userRouter.post('/signup', validate(signupUserSchema), signup);

userRouter.get('/activateCode/:email', validate(emailSchema), getActivateCode);
userRouter.post('/activate', validate(activateSchema), activate);

// Passwords: forgot, reset, update

userRouter.get('/forgotPassword/:email', validate(emailSchema), forgotPassword);

export default userRouter;
