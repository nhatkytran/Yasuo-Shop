import mongoose from 'mongoose';

export type PurchaseInput = {
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  price: number;
  quantity: number;
  paid?: Boolean;
  shipped?: Boolean;
};

export interface PurchaseDocument extends PurchaseInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export const schemaDefs = {
  // product: { type: mongoose.Schema.ObjectId, ref: '', required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  shipped: { type: Boolean, default: false },
};

export const virtutalProperties = (schema: mongoose.Schema) => {
  schema.virtual('totalPrice').get(function () {
    const totalPrice: number =
      (this.price as number) * (this.quantity as number);

    return Number(totalPrice.toFixed(2));
  });
};
