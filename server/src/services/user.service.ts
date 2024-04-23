import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';

import AppError from '../utils/appError';
import Email from '../utils/sendEmail';
import { hashToken } from '../utils/tokenAndHash';

import User from '../models/users/user.model';
import { UserDocument, UserInput } from '../models/users/schemaDefs';

import {
  preventBannedUser,
  preventInactiveUser,
  unauthenticatedError,
} from './session.service';

export type UserObject = { user: UserDocument };

interface UserAndToken extends UserObject {
  token: string;
}

// Throw error when user created by OAuth: google,...
export const preventOAuthUser = (oAuth?: any): void => {
  if (Boolean(oAuth))
    throw new AppError({
      message: 'This feature only supports accounts created manually!',
      statusCode: 403,
    });
};

// Throw error when user is already active
const preventActiveUser = (active?: any): void => {
  if (Boolean(active))
    throw new AppError({
      message: 'User is already active!',
      statusCode: 400,
    });
};

// Throw error when user have not issue token yet
const preventNotIssuedToken = ({
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
const preventInvalidToken = ({
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

// Helper - Create tokens

interface CreateActionTokenOptions extends UserObject {
  type: 'activate' | 'forgotPassword';
}

const createActionToken = async ({
  user,
  type,
}: CreateActionTokenOptions): Promise<string> => {
  let token: string;

  if (type === 'activate') token = user.createActivateToken();
  if (type === 'forgotPassword') token = user.createForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  return token!;
};

// Helper - Send email

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
      await email.sendWelcome({ oAuth: false, code: token });

    if (sendMethod === 'sendActivate' && token)
      await email.sendActivate({ code: token });

    if (sendMethod === 'sendForgotPassword' && token)
      await email.sendForgotPassword({ code: token });
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

// Sign up - Create user //////////

type CreateUser = ({ input }: { input: UserInput }) => Promise<{
  user: UserDocument;
  token: string;
}>;

export const createUser: CreateUser = async ({ input }) => {
  const { name, email, password } = input; // Prevent user input -> active: true

  const user = await User.create({ name, email, password });
  const token = await createActionToken({ user, type: 'activate' });

  return {
    user: omit(user.toJSON(), 'password', 'ban') as UserDocument,
    token,
  };
};

export const sendCreateUserEmail = async ({
  user,
  token,
}: UserAndToken): Promise<void> =>
  await handleSendEmails({
    user,
    token,
    sendMethod: 'sendWelcome',
    field: 'activateToken',
    errorMessage: 'Please activate account manually.',
  });

// Find user using query: _id, email,... //////////

type FindUserOptions = {
  query: FilterQuery<UserDocument>;
  selectFields?: Array<keyof UserDocument>;
};

export const findUser = async ({
  query,
  selectFields,
}: FindUserOptions): Promise<UserDocument> => {
  let mongooseQuery = User.findOne(query);

  selectFields?.forEach(
    field => (mongooseQuery = mongooseQuery.select(`+${field}`))
  );

  const user = await mongooseQuery;

  if (!user)
    throw new AppError({ message: 'User not found!', statusCode: 404 });

  return user;
};

// Get activate code //////////

export const createActivateToken = async ({
  user,
}: UserObject): Promise<string> => {
  preventBannedUser(user.ban);
  preventOAuthUser(user.googleID);
  preventActiveUser(user.active);

  return await createActionToken({ user, type: 'activate' });
};

export const sendActivateTokenEmail = async ({
  user,
  token,
}: UserAndToken): Promise<void> =>
  await handleSendEmails({
    user,
    token,
    sendMethod: 'sendActivate',
    field: 'activateToken',
  });

// Activate user -> active: true //////////

type ActivateUser = ({ user, token }: UserAndToken) => Promise<void>;

export const activateUser: ActivateUser = async ({ user, token }) => {
  preventBannedUser(user.ban);
  preventOAuthUser(user.googleID);
  preventActiveUser(user.active);

  preventNotIssuedToken({
    tokenField: user.activateToken,
    codeUrl: '/api/v1/users/activateCode/:email',
  });

  preventInvalidToken({ token, rawToken: user.activateToken! });

  user.active = true;
  user.activateToken = undefined;

  await user.save({ validateModifiedOnly: true });
};

// Forgot password code //////////

export const createForgotPasswordToken = async ({
  user,
}: UserObject): Promise<string> => {
  preventBannedUser(user.ban);
  preventOAuthUser(user.googleID);

  return await createActionToken({ user, type: 'forgotPassword' });
};

export const sendForgotPasswordTokenEmail = async ({
  user,
  token,
}: UserAndToken): Promise<void> =>
  await handleSendEmails({
    user,
    token,
    sendMethod: 'sendForgotPassword',
    field: 'forgotPasswordToken',
  });

// Reset user's password for forgetting password //////////

interface ResetUserPasswordOptions extends UserAndToken {
  newPassword: string;
}

export const resetUserPassword = async ({
  user,
  token,
  newPassword,
}: ResetUserPasswordOptions): Promise<void> => {
  preventBannedUser(user.ban);
  preventOAuthUser(user.googleID);

  preventNotIssuedToken({
    tokenField: user.forgotPasswordToken,
    codeUrl: '/api/v1/users/forgotPassword/:email',
  });

  preventInvalidToken({ token, rawToken: user.forgotPasswordToken! });

  user.password = newPassword;
  user.forgotPasswordToken = undefined;

  await user.save({ validateModifiedOnly: true });
};

// Change password //////////

type ChangePasswordOptions = {
  user: UserDocument;
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async ({
  user,
  currentPassword,
  newPassword,
}: ChangePasswordOptions): Promise<void> => {
  preventBannedUser(user.ban);
  preventOAuthUser(user.googleID);
  preventInactiveUser(user.active);

  if (!(await user.comparePassword(currentPassword)))
    throw unauthenticatedError('Incorrect currentPassword!');

  if (currentPassword === newPassword)
    throw new AppError({
      message: 'The new password is the same as the old one!',
      statusCode: 400,
    });

  user.password = newPassword;

  await user.save({ validateModifiedOnly: true });
};
