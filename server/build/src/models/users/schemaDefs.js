"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaDefs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.schemaDefs = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    photo: { type: String, default: '/img/users/default.png' },
    active: { type: Boolean, default: false },
    ban: { type: Boolean, default: false },
    delete: { byAdmin: { type: Boolean }, deleteAt: { type: Date } },
    googleID: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    activateToken: { type: String, select: false },
    forgotPasswordToken: { type: String, select: false },
    passwordChangedAt: { type: Date, select: false },
    restoreToken: { type: String, select: false },
    cart: [
        {
            language: { type: String, enum: ['en-us', 'fr'] },
            items: [
                {
                    productId: { type: mongoose_1.default.Schema.ObjectId, required: true },
                    quantity: { type: Number, required: true },
                },
            ],
        },
    ],
};
