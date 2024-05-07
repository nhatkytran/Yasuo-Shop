import mongoose from 'mongoose';

import { ProductDocument } from '../products/schemaDefs';
import ProductEnUS from '../products/productEnUs.model';
import ProductFR from '../products/productFr.model';

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

// Indexes //////////

export const indexes = (schema: mongoose.Schema<ReviewDocument>) => {
  schema.index({ user: 1, product: 1 }, { unique: true });
};

// Populate //////////

export const populates = (schema: mongoose.Schema<ReviewDocument>) => {
  schema.pre<ReviewDocument>(/^find/, function (next) {
    this.populate({ path: 'product', select: 'name' });
    this.populate({ path: 'user', select: 'name photo' });

    next();
  });
};

// Static methods //////////

type Language = 'en-us' | 'fr';

export const staticMethods = (
  schema: mongoose.Schema<ReviewDocument>,
  language: Language
) => {
  schema.statics.calcAverageRatings = async function (productID) {
    const stats = await this.aggregate([
      { $match: { product: productID } },
      {
        $group: {
          _id: '$product',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    let ProductModel: mongoose.Model<ProductDocument> = ProductEnUS; // 'en-us'
    if (language === 'fr') ProductModel = ProductFR;

    await ProductModel.findByIdAndUpdate(productID, {
      ratingsQuantity: stats[0]?.nRating || 0,
      ratingsAverage: stats[0]?.avgRating || 0,
    });
  };
};

interface ReviewModelInterface extends mongoose.Model<ReviewDocument> {
  calcAverageRatings(productID: mongoose.Schema.Types.ObjectId): Promise<void>;
}

// Post Hooks //////////

export const postHooks = (schema: mongoose.Schema<ReviewDocument>) => {
  schema.post<ReviewDocument>('save', function () {
    (this.constructor as ReviewModelInterface).calcAverageRatings(this.product);
  });

  schema.post<ReviewDocument>(/^findOneAnd/, document => {
    (document.constructor as ReviewModelInterface).calcAverageRatings(
      // populate review changed product field
      // @ts-ignore
      document.product._id
    );
  });
};
