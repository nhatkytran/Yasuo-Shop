import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

import { createTokens } from '../../utils/tokenAndHash';
import { UserDocument, schemaDefs } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<UserDocument>(schemaDefs, schemaSups);

// Middlewares //////////

schema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) return next();

  user.password = await bcrypt.hash(
    user.password,
    config.get<number>('bcryptSaltFactor')
  );

  if (!this.isNew) user.passwordChangedAt = new Date();

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

schema.methods.createRestoreToken = createTokenFactory({
  field: 'restoreToken',
  timeoutMinute: 2,
});

schema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

schema.methods.changedPassword = function (loginTimestamp: number): boolean {
  if (!this.passwordChangedAt) return false;
  return loginTimestamp < this.passwordChangedAt.getTime();
};

const User = mongoose.model<UserDocument>('User', schema, 'users');

export default User;
