"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
// There are some empty array value for key in document in database
// Remove them to make data more clean and good for performance
const removeEmptyArray = (obj) => {
    const result = {};
    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value.length)
                result[key] = value;
            return; // return in both cases -> empty and not empty array
        }
        if (typeof value === 'object' &&
            !(value instanceof Date) &&
            !(value instanceof mongoose.Types.ObjectId)) {
            return (result[key] = removeEmptyArray(value));
        }
        result[key] = value;
    });
    return result;
};
exports.default = removeEmptyArray;
