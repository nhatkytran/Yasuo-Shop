import express from 'express';

import validate from '../middleware/validateResource';
import { signinUserSchema } from '../schemas/session.schema';

import {
  deactivateAllSessions,
  deleteAllSessions,
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

sessionRouter
  .route('/')
  .get(getAllSessions)
  .patch(deactivateAllSessions) // Deactivate all sessions except for admin
  .delete(deleteAllSessions); // Delete all sessions except for admin

sessionRouter.route('/:sessionID').get(getSession);

// Deactivate one session, all sessions of oneuser
// Delelte one session, all sessions, all sessions of one user

export default sessionRouter;
