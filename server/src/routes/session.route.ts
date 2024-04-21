import express from 'express';

import validate from '../middleware/validateResource';
import { signinUserSchema } from '../schemas/session.schema';
import { protect, signin } from '../controllers/session.controller';

const sessionRouter = express.Router();

// Signin: Local, Goole. Sign jasonwebtoken, session,...

sessionRouter.post('/signin', validate(signinUserSchema), signin);

// test
sessionRouter.get('/test', protect, (req, res) => res.send('Hello World!'));

export default sessionRouter;
