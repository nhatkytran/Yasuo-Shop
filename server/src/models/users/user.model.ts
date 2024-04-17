import mongoose from 'mongoose';
import { schemaDefs, schemaSups } from './schemaDefs';

// UserDocument

const schema = new mongoose.Schema(schemaDefs, schemaSups);
const User = mongoose.model('User', schema, 'users');

export default User;
