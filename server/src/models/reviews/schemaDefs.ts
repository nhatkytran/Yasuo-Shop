import mongoose from 'mongoose';

export type ReviewInput = {
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  review: string;
  rating: number;
};

export interface ReviewDocument extends ReviewInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export const schemaDefs = {
  // product
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  review: { type: String, required: true, trim: true, maxLength: 300 },
  rating: { type: Number, required: true, min: 1, max: 5 },
};
