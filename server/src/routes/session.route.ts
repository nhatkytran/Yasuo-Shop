import express from 'express';

import validate from '../middleware/validateResource';
import {
  getAllSessionsSchema,
  getSessionSchema,
  signinUserSchema,
} from '../schemas/session.schema';

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
  signout,
} from '../controllers/session.controller';

const sessionRouter = express.Router({ mergeParams: true });

// Signin: Local, Goole. Sign jasonwebtoken, session,...

sessionRouter.post('/signin', validate(signinUserSchema), signin);
sessionRouter.get('/signout', protect, signout);
// sessionRouter.get('/signoutEverywhere/:userID');

// Sessions: Get, Delete, Deactivate (Update), Create (signin creates session)

sessionRouter.use(protect, restrictTo('admin'));

sessionRouter
  .route('/')
  // api/v1/users/:userID/sessions
  // Get all sessions (also for one user)
  .get(validate(getAllSessionsSchema), getAllSessions)
  // Deactivate all sessions except for admin
  // Deactivate all sessions for one user (also for admin)
  .patch(validate(getAllSessionsSchema), deactivateAllSessions)
  // Delete all sessions except for admin
  // Delete all sessions for one user (also for admin)
  .delete(deleteAllSessions);

sessionRouter
  .route('/:sessionID')
  // api/v1/users/:userID/sessions/:sessionID
  // Get a specific session by sessionID or sessionID with userID
  // Deactivate and Delete only uses sessionID
  .get(validate(getSessionSchema), getSession)
  .patch(validate(getSessionSchema), deactivateSession)
  .delete(validate(getSessionSchema), deleteSession);

export default sessionRouter;
