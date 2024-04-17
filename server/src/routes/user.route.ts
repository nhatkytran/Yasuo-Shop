import express from 'express';

import { signup } from '../controllers/user.controller';
import validate from '../middleware/validateResource';
import { signupUserSchema } from '../schemas/user.schema';

const userRouter = express.Router();

userRouter.get('/signup', validate(signupUserSchema), signup);

export default userRouter;
