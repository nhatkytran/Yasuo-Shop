import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import { findAllProducts } from '../services/product.service';
import isDev from '../utils/isDev';

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (isDev()) console.log('req.query ->', req.query);

    const products = await findAllProducts({
      language: res.locals.language,
      reqQuery: req.query,
    });

    res.status(200).json({
      status: 'success',
      language: res.locals.language,
      numResults: products.length,
      products,
    });
  }
);

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);

  res.status(200).json({
    status: 'success',
    language: res.locals.language,
  });
});
