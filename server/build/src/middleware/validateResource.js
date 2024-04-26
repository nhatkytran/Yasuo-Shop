"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        const message = error.errors
            .map((err) => {
            const { code, expected, message, path } = err;
            return `${code} - ${expected}: ${message} - ${path
                .slice(1)
                .join('.')}`;
        })
            .join('; ');
        // All errors that are thrown by middleware will be handled in Global Error Handling
        throw new appError_1.default({ message, statusCode: 400 });
    }
};
exports.default = validate;
