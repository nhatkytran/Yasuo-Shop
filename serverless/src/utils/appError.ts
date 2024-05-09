type CustomError = {
  message: string;
  statusCode: number;
};

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor({ message, statusCode }: CustomError) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
