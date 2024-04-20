import mongoose from 'mongoose';

export interface SessionDocument extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export const schemaDefs = {
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  valid: { type: Boolean, default: true },
  userAgent: { type: String },
};
