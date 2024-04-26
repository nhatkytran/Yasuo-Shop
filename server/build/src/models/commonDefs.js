"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaSups = void 0;
exports.schemaSups = {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
};
