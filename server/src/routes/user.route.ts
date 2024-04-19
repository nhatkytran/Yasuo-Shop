import express from 'express';

import validate from '../middleware/validateResource';

import {
  activateSchema,
  emailSchema,
  signupUserSchema,
} from '../schemas/user.schema';

import {
  activate,
  getActivateCode,
  signup,
} from '../controllers/user.controller';

const userRouter = express.Router();

// Create user and activate user (confirm that email of user exists)

userRouter.get('/signup', validate(signupUserSchema), signup);

userRouter.get('/activateCode/:email', validate(emailSchema), getActivateCode);
userRouter.post('/activate', validate(activateSchema), activate);

export default userRouter;
