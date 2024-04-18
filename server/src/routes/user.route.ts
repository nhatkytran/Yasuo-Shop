import express from 'express';

import { getActivateCode, signup } from '../controllers/user.controller';
import validate from '../middleware/validateResource';
import { emailSchema, signupUserSchema } from '../schemas/user.schema';

const userRouter = express.Router();

userRouter.get('/signup', validate(signupUserSchema), signup);

userRouter.get('/activateCode/:email', validate(emailSchema), getActivateCode);

export default userRouter;
