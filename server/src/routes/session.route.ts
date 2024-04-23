import express from 'express';

import validate from '../middleware/validateResource';
import { getSessionSchema, signinUserSchema } from '../schemas/session.schema';

import {
  deactivateAllSessions,
  deactivateSession,
  deleteAllSessions,
  deleteSession,
  getAllSessions,
  getSession,
  protect,
  restrictTo,
  signin,
} from '../controllers/session.controller';

const sessionRouter = express.Router({ mergeParams: true });

// Signin: Local, Goole. Sign jasonwebtoken, session,...

sessionRouter.post('/signin', validate(signinUserSchema), signin);

// Sessions: Get, Delete, Deactivate (Update), Create (signin creates session)

sessionRouter.use(protect, restrictTo('admin'));

sessionRouter
  .route('/')
  .get(getAllSessions)
  .patch(deactivateAllSessions) // Deactivate all sessions except for admin
  .delete(deleteAllSessions); // Delete all sessions except for admin

sessionRouter
  .route('/:sessionID')
  .get(validate(getSessionSchema), getSession)
  .patch(validate(getSessionSchema), deactivateSession)
  .delete(validate(getSessionSchema), deleteSession);

export default sessionRouter;
