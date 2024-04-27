"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtutalProperties = exports.schemaDefs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.schemaDefs = {
    name: { type: String, required: true, unique: true },
    price: {
        default: { type: Number, required: true },
        saleAmount: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        set: (value) => Math.round(value * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
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
    descriptions: { type: [mongoose_1.default.Schema.Types.Mixed] },
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
const virtutalProperties = (schema) => {
    schema.virtual('price.priceAfterSale').get(function () {
        const price = this.price;
        if (price.saleAmount !== 0)
            return Number((price.default - price.saleAmount).toFixed(2));
    });
};
exports.virtutalProperties = virtutalProperties;
