import mongoose from 'mongoose';

export type ProductInput = {
  name: string;
  price: {
    default: number;
    saleAmount?: number;
    currency?: string;
  };
  editions?: {
    en: ('limited edition' | 'preorder' | 'special edition')[];
    other?: string[];
  };
  images: string[];
  type: 'figure' | 'game' | 'cloth' | 'item';
  category: 'featured' | 'sale';
  optional?: {
    title: string;
    image: string;
  };
  sizes?: string[];
  platforms?: string[];
  regions?: string[];
  check?: string;
  warning?: string;
  shippingDays?: number;
  quote?: string;
  descriptions: (string | string[])[];
  features?: string[];
  approximateDimensions?: {
    value: number[][];
    en: ('height' | 'width' | 'depth')[];
    other?: string[];
  };
  funFact?: string;
  series?: string;
  materials?: string[];
};

export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt?: Date;
  updatedAt?: Date;
}

export const schemaDefs = {
  name: { type: String, required: true, unique: true },
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
};

export const schemaSups = {
  timestamps: true, // createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false,
};
