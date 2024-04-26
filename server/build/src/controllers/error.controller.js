"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../utils/env"));
const logger_1 = __importDefault(require("../utils/logger"));
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (error) => new appError_1.default({
    message: `Invalid ${error.path}: ${error.value}`,
    statusCode: 400,
});
const handleValidationErrorDB = (error) => new appError_1.default({ message: error.message, statusCode: 400 });
const handleDuplicateError = (error) => {
    const [key, value] = Object.entries(error.keyValue)[0];
    return new appError_1.default({
        message: `Duplicate field < ${key} >: < ${value} >. Please use another value!`,
        statusCode: 400,
    });
};
const globalErrorHandler = (error, req, res, _) => {
    let newError = env_1.default.dev ? error : Object.create(error);
    if (env_1.default.prod) {
        // CastError --> Invalid id
        if (newError.name === 'CastError')
            newError = handleCastErrorDB(newError);
        // ValidationError
        if (newError.name === 'ValidationError')
            newError = handleValidationErrorDB(newError);
        // Duplicate Error
        if (newError.code === 11000)
            newError = handleDuplicateError(newError);
    }
    const statusCode = newError.statusCode || 500;
    const status = newError.status || 'error';
    const message = newError.message || 'Something went wrong!';
    const { stack, isOperational } = newError;
    const errorObject = { error: newError, statusCode, status, message };
    if (env_1.default.dev)
        sendErrorDev(Object.assign(Object.assign({}, errorObject), { stack }), res);
    if (env_1.default.prod)
        sendErrorProd(Object.assign(Object.assign({}, errorObject), { isOperational }), res);
};
const sendErrorDev = (errorObject, res) => {
    const { error, statusCode, status, message, stack } = errorObject;
    res.status(statusCode).json({ status, message, error, stack });
};
const sendErrorProd = (errorObject, res) => {
    const { isOperational } = errorObject;
    if (isOperational) {
        const { statusCode, status, message } = errorObject;
        return res.status(statusCode).json({ status, message });
    }
    const message = 'Something went wrong!';
    logger_1.default.error(errorObject.error, message);
    res.status(500).json({ status: 'error', message: message });
};
exports.default = globalErrorHandler;
