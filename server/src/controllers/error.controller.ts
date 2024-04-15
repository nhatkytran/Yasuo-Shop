import { Request, Response, NextFunction } from 'express';

import env from '../utils/env';
import logger from '../utils/logger';
import AppError from '../utils/appError';

const handleCastErrorDB = (error: any) =>
  new AppError({
    message: `Invalid ${error.path}: ${error.value}`,
    statusCode: 400,
  });

const handleValidationErrorDB = (error: any) =>
  new AppError({ message: error.message, statusCode: 400 });

const handleDuplicateError = (error: any) => {
  const [key, value] = Object.entries(error.keyValue)[0];

  return new AppError({
    message: `Duplicate field < ${key} >: < ${value} >. Please use another value!`,
    statusCode: 400,
  });
};

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  let newError = env.dev ? error : Object.create(error);

  if (env.prod) {
    // CastError --> Invalid id
    if (newError.name === 'CastError') newError = handleCastErrorDB(newError);

    // ValidationError
    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);

    // Duplicate Error
    if (newError.code === 11000) newError = handleDuplicateError(newError);
  }

  const statusCode = newError.statusCode || 500;
  const status = newError.status || 'error';
  const message = newError.message || 'Something went wrong!';
  const { stack, isOperational } = newError;

  const errorObject = { error: newError, statusCode, status, message };

  if (env.dev) sendErrorDev({ ...errorObject, stack }, res);
  if (env.prod) sendErrorProd({ ...errorObject, isOperational }, res);
};

const sendErrorDev = (errorObject: any, res: Response) => {
  const { error, statusCode, status, message, stack } = errorObject;
  res.status(statusCode).json({ status, message, error, stack });
};

const sendErrorProd = (errorObject: any, res: Response) => {
  const { isOperational } = errorObject;

  if (isOperational) {
    const { statusCode, status, message } = errorObject;
    return res.status(statusCode).json({ status, message });
  }

  const message = 'Something went wrong!';

  logger.error(errorObject.error, message);
  res.status(500).json({ status: 'error', message: message });
};

export default globalErrorHandler;
