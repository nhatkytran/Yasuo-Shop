import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

import AppError from '../utils/appError';

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: any) {
      const message: string = error.errors
        .map((err: any) => {
          const { code, expected, message, path } = err;

          return `${code} - ${expected}: ${message} - ${path
            .slice(1)
            .join('.')}`;
        })
        .join('; ');

      // All errors that are thrown by middleware will be handled in Global Error Handling
      throw new AppError({ message, statusCode: 400 });
    }
  };

export default validate;
