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
      enum: ['limited', 'preorder', 'special'],
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
    warning: { type: String },
    shippingDays: { type: Number, default: 7 },
    quote: { type: String },
    descriptions: [String],
    features: [String],
    approximateDimensions: {
      height: [Number],
      width: [Number],
      depth: [Number],
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
