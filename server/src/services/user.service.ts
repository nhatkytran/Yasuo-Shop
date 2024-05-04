import { FilterQuery, UpdateQuery } from 'mongoose';
import { omit } from 'lodash';

import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import User from '../models/users/user.model';
import { UserDocument, UserInput } from '../models/users/schemaDefs';
import { unauthenticatedError } from './session.service';

import {
  FindAllEntities,
  UserAndToken,
  UserObject,
  createActionToken,
  handleSendEmails,
  preventActiveUser,
  preventBannedUser,
  preventDeletedUser,
  preventInactiveUser,
  preventInvalidToken,
  preventNotIssuedToken,
  preventOAuthUser,
  preventUndeletedUser,
} from './common.service';

// Sign up - Create user //////////

type CreateUserOptions = { input: UserInput; isAdmin?: boolean };

export const createUser = async ({
  input,
  isAdmin = false,
}: CreateUserOptions): Promise<{ user: UserDocument; token: string | '' }> => {
  let createInput: object = input;

  if (!isAdmin) {
    const { name, email, password } = input; // Prevent user input -> active: true

    createInput = { name, email, password };
  }

  const user = await User.create(createInput);

  let token = '';

  if (!isAdmin) token = await createActionToken({ user, type: 'activate' });

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

// Find all users (only ad) //////////

export const findAllUsers: FindAllEntities<UserDocument> = async ({
  reqQuery = {},
  findOptions = {},
}) => {
  const features = await APIFeatures({ model: User, reqQuery, findOptions });

  features.filter().sort().project().paginate();

  return await features.result();
};

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

  if (selectFields)
    mongooseQuery = mongooseQuery.select(
      selectFields.map(field => `+${field}`).join(' ')
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
  preventDeletedUser(user.delete);
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
  preventDeletedUser(user.delete);
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
  preventDeletedUser(user.delete);
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
  preventDeletedUser(user.delete);
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
  preventDeletedUser(user.delete);
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

// Update user: name, delete,... //////////

type UpdateUserOptions = {
  filter: FilterQuery<UserDocument>;
  update: UpdateQuery<UserDocument>;
};

export const updateUser = async ({ filter, update }: UpdateUserOptions) =>
  await User.updateOne(filter, update);

// Who delete user? //////////

type IdentifyWhoDeleteUserOptions = {
  whoUser: UserDocument;
  deletedUserEmail: string;
};

export const identifyWhoDeleteUser = ({
  whoUser,
  deletedUserEmail,
}: IdentifyWhoDeleteUserOptions): void => {
  if (whoUser.role === 'admin') return;

  if (whoUser.role === 'user' && whoUser.email !== deletedUserEmail)
    throw new AppError({
      message: 'You can only delete your own account!',
      statusCode: 400,
    });
};

// Get restore code //////////

export const createRestoreToken = async ({
  user,
}: UserObject): Promise<string> => {
  preventBannedUser(user.ban);
  preventDeletedUser(user.delete, 'onlyByAdmin');
  preventUndeletedUser(user.delete);

  return await createActionToken({ user, type: 'restore' });
};

export const sendRestoreEmail = async ({
  user,
  token,
}: UserAndToken): Promise<void> =>
  await handleSendEmails({
    user,
    token,
    sendMethod: 'sendRestore',
    field: 'restoreToken',
  });

// User restore user //////////

export const restoreUser = async ({
  user,
  token,
}: UserAndToken): Promise<void> => {
  preventBannedUser(user.ban);
  preventDeletedUser(user.delete, 'onlyByAdmin');
  preventUndeletedUser(user.delete);

  preventNotIssuedToken({
    tokenField: user.restoreToken,
    codeUrl: '/api/v1/users/userRestoreCode/:email',
  });

  preventInvalidToken({ token, rawToken: user.restoreToken! });

  user.delete = undefined;
  user.restoreToken = undefined;

  await user.save({ validateModifiedOnly: true });
};
