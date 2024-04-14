import { NextFunction, Request, Response } from 'express';
import config from 'config';

import AppError from '../utils/appError';

const trackLanguage = (req: Request, res: Response, next: NextFunction) => {
  const language = req.query.language as string | undefined;

  if (language && !config.get<[string]>('languageSupport').includes(language))
    throw new AppError({
      message: `Language '${language}' is not supported!`,
      statusCode: 400,
    });

  res.locals.language = (language ||
    config.get<string>('defaultLanguage')) as string;

  next();
};

export default trackLanguage;
