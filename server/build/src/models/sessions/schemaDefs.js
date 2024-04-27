"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaDefs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.schemaDefs = {
    user: { type: mongoose_1.default.Schema.ObjectId, ref: 'User' },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
};
