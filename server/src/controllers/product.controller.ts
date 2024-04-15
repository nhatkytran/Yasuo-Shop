import { Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { findAllProducts, findProductByID } from '../services/product.service';
import env from '../utils/env';

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (env.dev) console.log('req.query ->', req.query);

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

// schema Zod for param
// implement options
export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await findProductByID({
    language: res.locals.language,
    productID: id,
  });

  if (!product)
    throw new AppError({
      message: `Product with ID '${id}' not found!`,
      statusCode: 404,
    });

  res.status(200).json({
    status: 'success',
    language: res.locals.language,
    numResults: 1,
    product,
  });
});
