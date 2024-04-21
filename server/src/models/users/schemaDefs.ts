import mongoose from 'mongoose';

export type UserInput = {
  name: string;
  email: string;
  password: string;
  photo?: string;
  active?: boolean;
  ban?: boolean;
  googleID?: string;
  activateToken?: string;
  forgotPasswordToken?: string;
  passwordChangedAt?: Date;
};

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt?: Date;
  updatedAt?: Date;
  createActivateToken(): string;
  createForgotPasswordToken(): string;
  comparePassword(password: string): Promise<boolean>;
  changedPassword(loginTimestamp: number): boolean;
}

export const schemaDefs = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  photo: { type: String, default: '/img/users/default.png' },
  active: { type: Boolean, default: false },
  ban: { type: Boolean, default: false },
  googleID: { type: String, select: false },
  activateToken: { type: String, select: false },
  forgotPasswordToken: { type: String, select: false },
  passwordChangedAt: { type: Date, select: false },
};
