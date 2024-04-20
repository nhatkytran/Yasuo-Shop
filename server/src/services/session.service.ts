import mongoose from 'mongoose';

import Session from '../models/sessions/session.model';
import { SessionDocument } from '../models/sessions/schemaDefs';

import AppError from '../utils/appError';

import { preventOAuthUser } from './user.service';
import { UserObject } from './user.service';

// Throw error when banned user performs action
const preventBannedUser = (isBanned?: any) => {
  if (Boolean(isBanned))
    throw new AppError({
      message: 'Your account has been banned!',
      statusCode: 403,
    });
};

// Throw error when inactive user
const preventInactiveUser = (active?: any): void => {
  if (!Boolean(active))
    throw new AppError({
      message:
        'First you need to activate you account at /api/v1/users/activateCode/:email',
      statusCode: 401,
    });
};

// Validate password //////////

interface ValidatePasswordOptions extends UserObject {
  password: string;
}

export const validatePassword = async ({
  user,
  password,
}: ValidatePasswordOptions): Promise<void> => {
  preventOAuthUser(user.googleID);
  preventBannedUser(user.ban);
  preventInactiveUser(user.active);

  if (!(await user.comparePassword(password)))
    throw new AppError({ message: 'Incorrect password!', statusCode: 401 });
};

// Create session //////////

type CreateSessionOptions = {
  userID: mongoose.Schema.Types.ObjectId;
  userAgent: string;
};

export async function createSession({
  userID,
  userAgent,
}: CreateSessionOptions): Promise<SessionDocument> {
  return (await Session.create({ user: userID, userAgent })) as SessionDocument;
}
