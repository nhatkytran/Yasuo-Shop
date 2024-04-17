import { omit } from 'lodash';

import User from '../models/users/user.model';
import { UserDocument, UserInput } from '../models/users/schemaDefs';

type CreateUser = ({ input }: { input: UserInput }) => Promise<UserDocument>;

export const createUser: CreateUser = async ({ input }) => {
  // Prevent user input -> active: true
  const { name, email, password } = input;

  const user = await User.create({ name, email, password });

  return omit(user.toJSON(), 'password', 'ban') as UserDocument;
};
