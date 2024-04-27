import { NextFunction, Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';

type ReduceObject = { [key: string]: any };

const deepSanitize = (value: any): any => {
  if (typeof value === 'string')
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });

  if (Array.isArray(value)) return value.map(deepSanitize);

  if (typeof value === 'object' && value !== null)
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = deepSanitize(value[key]);
      return acc;
    }, {} as ReduceObject);

  return value;
};

const xssSanitize = (req: Request, res: Response, next: NextFunction) => {
  req.params = deepSanitize(req.params);
  req.query = deepSanitize(req.query);
  req.body = deepSanitize(req.body);

  next();
};

export default xssSanitize;
