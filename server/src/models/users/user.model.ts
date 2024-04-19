import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

import { UserDocument, schemaDefs, schemaSups } from './schemaDefs';
import { createTokens } from '../../utils/tokenAndHash';

const schema = new mongoose.Schema<UserDocument>(schemaDefs, schemaSups);

// Middlewares //////////

schema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) return next();

  user.password = await bcrypt.hash(
    user.password,
    config.get<number>('bcryptSaltFactor')
  );

  next();
});

// Schema methods //////////

type createTokenOptions = { field: string; timeoutMinute: number };

// ts ignore for this keyword -> this points to user document
// this function will be a schema method
const createTokenFactory = ({ field, timeoutMinute }: createTokenOptions) =>
  function () {
    const { token, hash } = createTokens({ timeoutMinute });

    // @ts-ignore
    this[field] = hash;

    return token;
  };

schema.methods.createActivateToken = createTokenFactory({
  field: 'activateToken',
  timeoutMinute: 2,
});

schema.methods.createForgotPasswordToken = createTokenFactory({
  field: 'forgotPasswordToken',
  timeoutMinute: 2,
});

const User = mongoose.model<UserDocument>('User', schema, 'users');

export default User;
