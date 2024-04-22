import express from 'express';

import validate from '../middleware/validateResource';
import { signinUserSchema } from '../schemas/session.schema';
import { protect, restrictTo, signin } from '../controllers/session.controller';

const sessionRouter = express.Router();

// Signin: Local, Goole. Sign jasonwebtoken, session,...

sessionRouter.post('/signin', validate(signinUserSchema), signin);

// Sessions: Get, Delete, Deactivate

sessionRouter.get('/test', protect, restrictTo('admin'), (req, res) =>
  res.send('Hello')
);

export default sessionRouter;
