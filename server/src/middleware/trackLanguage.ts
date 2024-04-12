import { NextFunction, Request, Response } from 'express';
import config from 'config';

const trackLanguage = (req: Request, res: Response, next: NextFunction) => {
  res.locals.language =
    req.query.language || config.get<string>('defaultLanguage');

  next();
};

export default trackLanguage;
