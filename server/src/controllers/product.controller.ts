import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import { findAllProducts } from '../services/product.service';

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await findAllProducts({
      language: res.locals.language,
    });

    res
      .status(200)
      .json({ status: 'success', language: res.locals.language, products });
  }
);
