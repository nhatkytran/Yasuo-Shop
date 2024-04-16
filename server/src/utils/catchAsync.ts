import { Request, Response, NextFunction } from 'express';

// Generic here because sometimes we want to define type of params, query,...
const catchAsync =
  <Req extends Request, Res extends Response>(
    asyncCallback: (req: Req, res: Res, next: NextFunction) => Promise<void>
  ) =>
  (req: Req, res: Res, next: NextFunction) =>
    asyncCallback(req, res, next).catch(next);

export default catchAsync;
