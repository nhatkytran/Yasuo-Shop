import express from 'express';

import validate from '../middleware/validateResource';
import { signinUserSchema } from '../schemas/session.schema';
import { signin } from '../controllers/session.controller';

const sessionRouter = express.Router();

// Signin: Local, Goole. Sign jasonwebtoken, session,...

sessionRouter.post('/signin', validate(signinUserSchema), signin);

export default sessionRouter;
