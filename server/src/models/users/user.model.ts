import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

import { UserDocument, schemaDefs, schemaSups } from './schemaDefs';
import { createTokens } from '../../utils/tokenAndHash';

const schema = new mongoose.Schema(schemaDefs, schemaSups);

schema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) return next();

  user.password = await bcrypt.hash(
    user.password,
    config.get<number>('bcryptSaltFactor')
  );

  next();
});

schema.methods.createActivateToken = function () {
  const { token, hash } = createTokens({ timeoutMinute: 2 });

  this.activateToken = hash;

  return token;
};

const User = mongoose.model<UserDocument>('User', schema, 'users');

export default User;
