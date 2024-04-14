import mongoose from 'mongoose';

export const schemaDefs = {
  name: { type: String, required: true },
  price: {
    default: { type: Number, required: true },
    saleAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  editions: {
    en: {
      type: [String],
      enum: ['limited edition', 'preorder', 'special edition'],
    },
    other: { type: [String] },
  },
  images: [String],
  information: {
    type: {
      type: String,
      enum: ['figure', 'game', 'cloth', 'item'],
      required: true,
    },
    category: {
      type: String,
      enum: ['featured', 'sale'],
      required: true,
    },
    optional: {
      title: { type: String },
      image: { type: String },
    },
    sizes: [String],
    platforms: [String],
    regions: [String],
    check: { type: String },
    warning: { type: String },
    shippingDays: { type: Number, default: 7 },
    quote: { type: String },
    descriptions: { type: [mongoose.Schema.Types.Mixed] },
    features: [String],
    approximateDimensions: {
      value: [[Number]],
      en: [String],
      other: [String],
    },
    funFact: { type: String },
    series: { type: String },
    materials: [String],
  },
};

export const schemaSups = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false,
};
