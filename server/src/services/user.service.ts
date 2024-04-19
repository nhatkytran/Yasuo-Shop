import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';

import AppError from '../utils/appError';
import Email from '../utils/sendEmail';
import User from '../models/users/user.model';
import { UserDocument, UserInput } from '../models/users/schemaDefs';

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

// Find user using query: _id, email,... //////////

type FindUserOptions = { query: FilterQuery<UserDocument> };
type FindUser = ({ query }: FindUserOptions) => Promise<UserDocument>;

export const findUser: FindUser = async ({ query }) => {
  const user = await User.findOne(query);

  if (!user)
    throw new AppError({ message: `User not found!`, statusCode: 404 });

  return user as UserDocument;
};

// Create token for validation next actions //////////

type CreateActionTokenOptions = { user: UserDocument; type: 'activate' };

type CreateActionToken = ({
  user,
  type,
}: CreateActionTokenOptions) => Promise<string>;

export const createActionToken: CreateActionToken = async ({ user, type }) => {
  let token: string;

  if (type === 'activate') token = user.createActivateToken();

  await user.save({ validateBeforeSave: false });

  return token!;
};

// Send emails to user //////////

type HandleSendEmailsOptions = {
  user: UserDocument;
  token?: string;
  sendMethod: keyof Email;
  field?: string;
  errorMessage: string;
};

type HandleSendEmails = ({ user }: HandleSendEmailsOptions) => Promise<void>;

export const handleSendEmails: HandleSendEmails = async ({
  user,
  token,
  sendMethod,
  field,
  errorMessage,
}) => {
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
