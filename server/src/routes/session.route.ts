import express from 'express';

import validate from '../middleware/validateResource';
import { signinUserSchema } from '../schemas/session.schema';

import {
  getAllSessions,
  getSession,
  protect,
  restrictTo,
  signin,
} from '../controllers/session.controller';

const sessionRouter = express.Router();

// Signin: Local, Goole. Sign jasonwebtoken, session,...

sessionRouter.post('/signin', validate(signinUserSchema), signin);

// Sessions: Get, Delete, Deactivate (Update), Create (signin creates session)

sessionRouter.use(protect, restrictTo('admin'));

sessionRouter.get('/', getAllSessions);
sessionRouter.get('/:sessionID', getSession);

export default sessionRouter;
