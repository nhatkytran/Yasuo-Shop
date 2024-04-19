import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';

import AppError from '../utils/appError';
import Email from '../utils/sendEmail';
import { hashToken } from '../utils/tokenAndHash';

import User from '../models/users/user.model';
import { UserDocument, UserInput } from '../models/users/schemaDefs';

type UserObject = { user: UserDocument };

interface UserAndToken extends UserObject {
  token: string;
}

// Helper - Create tokens

interface CreateActionTokenOptions extends UserObject {
  type: 'activate';
}

const createActionToken = async ({
  user,
  type,
}: CreateActionTokenOptions): Promise<string> => {
  let token: string;

  if (type === 'activate') token = user.createActivateToken();

  await user.save({ validateBeforeSave: false });

  return token!;
};

// Helper - Send email

interface HandleSendEmailsOptions extends UserObject {
  token?: string;
  sendMethod: keyof Email;
  field?: keyof UserDocument;
  errorMessage: string;
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

type FindUserOptions = { query: FilterQuery<UserDocument> };
type FindUser = ({ query }: FindUserOptions) => Promise<UserDocument>;

export const findUser: FindUser = async ({ query }) => {
  const user = await User.findOne(query).select('+activateToken');

  if (!user)
    throw new AppError({ message: `User not found!`, statusCode: 404 });

  return user;
};

// Get activate code //////////

type CreateActivateToken = ({ user }: UserObject) => Promise<string>;

export const createActivateToken: CreateActivateToken = async ({ user }) => {
  if (user.googleID)
    throw new AppError({
      message: 'Getting activate code only supports accounts created manually!',
      statusCode: 403,
    });

  if (user.active)
    throw new AppError({
      message: 'User is already active!',
      statusCode: 400,
    });

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
    errorMessage: 'Please activate account manually.',
  });

// Activate user -> active: true //////////

type ActivateUser = ({ user, token }: UserAndToken) => Promise<void>;

export const activateUser: ActivateUser = async ({ user, token }) => {
  if (user.active)
    throw new AppError({
      message: 'User is already active!',
      statusCode: 400,
    });

  if (!user.activateToken)
    throw new AppError({
      message:
        'Get your activate code first! (/api/v1/users/activateCode/:email)',
      statusCode: 401,
    });

  const [hash, timeout] = user.activateToken.split('/');

  if (hashToken(token) !== hash || Date.now() > Number(timeout))
    throw new AppError({
      message: 'Invalid token or token has expired!',
      statusCode: 401,
    });

  user.active = true;
  user.activateToken = undefined;

  await user.save({ validateModifiedOnly: true });
};
