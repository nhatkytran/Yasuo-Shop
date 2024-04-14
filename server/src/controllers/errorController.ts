import { Request, Response, NextFunction } from 'express';
import isDev from '../utils/isDev';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  let newError = isDev() ? error : Object.create(error);

  const statusCode = newError.statusCode || 500;
  const status = newError.status || 'error';
  const message = newError.message || 'Something went wrong!';
  const { stack, isOperational } = newError;

  const errorObject = { error: newError, statusCode, status, message };

  if (isDev()) sendErrorDev({ ...errorObject, stack }, res);

  res.send(newError);
};

const sendErrorDev = (errorObject: any, res: Response) => {
  const { error, statusCode, status, message, stack } = errorObject;
  res.status(statusCode).json({ status, message, error, stack });
};

export default globalErrorHandler;
