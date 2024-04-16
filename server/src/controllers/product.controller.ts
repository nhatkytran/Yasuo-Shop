import { Request, Response } from 'express';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { findAllProducts, findProductByID } from '../services/product.service';
import { QueryOptions } from 'mongoose';

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

interface GetProductOptions extends QueryOptions {
  fields?: string | string[];
}

// schema Zod for param
export const getProduct = catchAsync(
  async (
    req: Request<{ id?: string }, {}, {}, GetProductOptions>,
    res: Response
  ) => {
    const { id } = req.params;
    const options = { ...req.query };

    if (env.dev) console.log(id, options);

    const product = await findProductByID({
      language: res.locals.language,
      productID: id!,
      options,
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
  }
);
