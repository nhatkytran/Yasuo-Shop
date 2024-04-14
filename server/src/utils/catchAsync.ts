import { Request, Response, NextFunction } from 'express';

type AsyncVoidFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (asyncCallback: AsyncVoidFunction) =>
  (req: Request, res: Response, next: NextFunction) =>
    asyncCallback(req, res, next).catch(next);

export default catchAsync;
