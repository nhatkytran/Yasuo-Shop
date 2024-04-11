import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: {
      default: { type: Number, required: true },
      saleAmount: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    editions: [String],
    images: [String],
    information: {
      type: {
        type: String,
        enum: ["statue", "game", "cloth", "item"],
        required: true,
      },
      optional: {
        title: { type: String },
        image: { type: String },
      },
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
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Product = mongoose.model("Product", schema, "products");

export default Product;
