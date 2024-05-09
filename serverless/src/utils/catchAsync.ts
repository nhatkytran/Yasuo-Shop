import type { Handler } from '@netlify/functions';

const catchAsync = (fn: Handler) => {
  // @ts-ignore
  const asyncFunc: Handler = async (event, content, cb) => {
    try {
      return await fn(event, content, cb);
    } catch (error: any) {
      let statusCode: number = 500;
      let message = 'Something went wrong!';

      if (error.isOperational) {
        statusCode = error.statusCode;
        message = error.message;
      } else {
        console.log(error);
      }

      return { statusCode, body: JSON.stringify({ message }) };
    }
  };

  return asyncFunc;
};

export default catchAsync;
