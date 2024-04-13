import { Request, Response, NextFunction } from 'express';

import logger from '../utils/logger';
import ProductEnUS from '../models/products/productEnUs.model';

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await ProductEnUS.find();

    res
      .status(200)
      .json({ status: 'success', language: res.locals.language, products });
  } catch (error: any) {
    logger.error(error, 'Something went wrong!');
  }
};
