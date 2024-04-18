import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';

import User from '../models/users/user.model';
import { UserDocument, UserInput } from '../models/users/schemaDefs';

type CreateUser = ({ input }: { input: UserInput }) => Promise<UserDocument>;

export const createUser: CreateUser = async ({ input }) => {
  const { name, email, password } = input; // Prevent user input -> active: true

  return await User.create({ name, email, password });

  // return omit(user.toJSON(), 'password', 'ban') as UserDocument;
};

// type RemoveUserFields = ({
//   user,
//   fields,
// }: {
//   user: UserDocument;
//   fields: Array<keyof UserDocument>;
// }) => Promise<void>;

// const removeUserFields: RemoveUserFields = async ({ user, fields }) => {
//   fields.forEach(field => {
//     if (user[field] !== undefined) {
//       user[field as string] = undefined;
//     }
//   });

//   await user.save({ validateModifiedOnly: true });
// };

type FindUser = ({
  query,
}: {
  query: FilterQuery<UserDocument>;
}) => Promise<UserDocument | null>;

export const findUser: FindUser = async ({ query }) => {
  return await User.findOne(query);
};

type CreateActionToken = ({
  user,
  type,
}: {
  user: UserDocument;
  type: 'activate';
}) => Promise<string>;

export const createActionToken: CreateActionToken = async ({ user, type }) => {
  let token: string;

  if (type === 'activate') token = user.createActivateToken();

  await user.save({ validateBeforeSave: false });

  return token!;
};
