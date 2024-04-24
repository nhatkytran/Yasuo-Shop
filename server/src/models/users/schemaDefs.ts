import mongoose from 'mongoose';

type Item = { productId: mongoose.Schema.Types.ObjectId; quantity: Number };
type Cart = { language: 'en-us' | 'fr'; items: Array<Item> };

export type UserInput = {
  name: string;
  email: string;
  password: string;
  photo?: string;
  active?: boolean;
  ban?: boolean;
  googleID?: string;
  role?: 'user' | 'admin';
  activateToken?: string;
  forgotPasswordToken?: string;
  passwordChangedAt?: Date;
  cart?: Array<Cart>;
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
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  activateToken: { type: String, select: false },
  forgotPasswordToken: { type: String, select: false },
  passwordChangedAt: { type: Date, select: false },
  cart: [
    {
      language: { type: String, enum: ['en-us', 'fr'] },
      items: [
        {
          productId: { type: mongoose.Schema.ObjectId, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    },
  ],
};
