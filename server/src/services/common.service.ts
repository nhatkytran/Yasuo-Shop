import { FilterQuery, QueryOptions, Types, UpdateQuery } from 'mongoose';

import { UserDocument } from '../models/users/schemaDefs';
import User from '../models/users/user.model';
import AppError from '../utils/appError';
import dateFormat from '../utils/dateFormat';
import Email from '../utils/sendEmail';
import { hashToken } from '../utils/tokenAndHash';
import { unauthenticatedError } from './session.service';

// Common Types //////////

export type FindAllEntities<T> = ({
  language,
  reqQuery,
  findOptions,
}: {
  language?: string;
  reqQuery?: FilterQuery<T>;
  findOptions?: { [key: string]: Types.ObjectId };
}) => Promise<T[]>;

interface FindEntityByIDOptions extends QueryOptions {
  fields?: string | string[];
}

export type FindEntityByID<T> = ({
  language,
  entityID,
  options,
}: {
  language: string;
  entityID: string;
  options?: FindEntityByIDOptions;
}) => Promise<T>;

export type CreateEntity<T, U> = ({
  language,
  input,
}: {
  language: string;
  input: T;
}) => Promise<U>;

export interface UserAndToken extends UserObject {
  token: string;
}

export type FindAndUpdateEntity<T> = ({
  language,
  entityID,
  update,
  options,
}: {
  language: string;
  entityID: string;
  update: UpdateQuery<T>;
  options: QueryOptions;
}) => Promise<T | null>;

export type FindAndDeleteEntity = ({
  language,
  entityID,
}: {
  language: string;
  entityID: string;
}) => Promise<void>;

// Throw error when user have not issue token yet
export const preventNotIssuedToken = ({
  tokenField,
  codeUrl,
}: {
  tokenField?: string;
  codeUrl: string;
}): void => {
  if (!tokenField)
    throw new AppError({
      message: `Get your verification code first at ${codeUrl}`,
      statusCode: 401,
    });
};

// Throw error when token is invaid
export const preventInvalidToken = ({
  token,
  rawToken,
}: {
  token: string;
  rawToken: string;
}): void => {
  const [hash, timeout] = rawToken.split('/');

  if (hashToken(token) !== hash || Date.now() > Number(timeout))
    throw new AppError({
      message: 'Invalid token or token has expired!',
      statusCode: 401,
    });
};

// Throw error when user created by OAuth: google,...
export const preventOAuthUser = (oAuth?: any): void => {
  if (Boolean(oAuth))
    throw new AppError({
      message: 'This feature only supports accounts created manually!',
      statusCode: 403,
    });
};

// Throw error when deleted user performs action (by admin | user themself)
export const preventDeletedUser = (
  deleteObj: UserDocument['delete'],
  state?: 'onlyByAdmin'
) => {
  if (!deleteObj || !deleteObj?.deleteAt) return;
  if (state === 'onlyByAdmin' && !deleteObj.byAdmin) return;

  const date = dateFormat({ date: deleteObj.deleteAt, hasHour: true });

  const message = deleteObj.byAdmin
    ? `Your account has been deleted by admin on ${date}! Please contact admin via nhockkutean2@gmail.com for more information.`
    : `Your account has been deleted on ${date}! Restore your account at /api/v1/users/userRestoreCode/:email'`;

  throw new AppError({ message, statusCode: 403 });
};

// Throw error when deleted user performs action
export const preventUndeletedUser = (deleteObj: UserDocument['delete']) => {
  if (!deleteObj || !deleteObj?.deleteAt)
    throw new AppError({
      message: 'Your account is undeleted!',
      statusCode: 400,
    });
};

// Throw error when banned user performs action
export const preventBannedUser = (isBanned?: any) => {
  if (Boolean(isBanned))
    throw new AppError({
      message:
        'Your account has been banned! Please contact admin via nhockkutean2@gmail.com for more information.',
      statusCode: 403,
    });
};

// Throw error when user is already active
export const preventActiveUser = (active?: any): void => {
  if (Boolean(active))
    throw new AppError({
      message: 'User is already active!',
      statusCode: 400,
    });
};

// Throw error when inactive user
export const preventInactiveUser = (active?: any): void => {
  if (!Boolean(active))
    throw unauthenticatedError(
      'First you need to activate your account at /api/v1/users/activateCode/:email'
    );
};

// Helpers //////////

export type UserObject = { user: UserDocument };

interface CreateActionTokenOptions extends UserObject {
  type: 'activate' | 'forgotPassword' | 'restore' | 'google';
}

export const createActionToken = async ({
  user,
  type,
}: CreateActionTokenOptions): Promise<string> => {
  let token: string;

  if (type === 'activate') token = user.createActivateToken();
  if (type === 'forgotPassword') token = user.createForgotPasswordToken();
  if (type === 'restore') token = user.createRestoreToken();
  if (type === 'google') token = user.createGoogleToken();

  await user.save({ validateBeforeSave: false });

  return token!;
};

interface HandleSendEmailsOptions extends UserObject {
  token?: string;
  sendMethod: keyof Email;
  field?: keyof UserDocument;
  errorMessage?: string;
}

export const handleSendEmails = async ({
  user,
  token,
  sendMethod,
  field,
  errorMessage,
}: HandleSendEmailsOptions): Promise<void> => {
  try {
    const email = new Email(user);

    if (sendMethod === 'sendWelcome')
      await email.sendWelcome({ oAuth: !token, code: token });

    if (sendMethod === 'sendActivate' && token)
      await email.sendActivate({ code: token });

    if (sendMethod === 'sendForgotPassword' && token)
      await email.sendForgotPassword({ code: token });

    if (sendMethod === 'sendRestore' && token)
      await email.sendRestore({ code: token });
  } catch (error: any) {
    if (field)
      await User.updateOne({ _id: user._id }, { $unset: { [field]: 1 } });

    throw new AppError({
      message: `Something went wrong sending email!${errorMessage ? ' ' : ''}${
        errorMessage || ''
      }`,
      statusCode: 500,
    });
  }
};
