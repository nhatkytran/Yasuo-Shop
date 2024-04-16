import { Request, Response } from 'express';
import { QueryOptions } from 'mongoose';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { findAllProducts, findProductByID } from '../services/product.service';
import { GetProductInput } from '../schemas/product.schema';

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

export const getProduct = catchAsync(
  async (
    req: Request<GetProductInput['params'], {}, {}, GetProductOptions>,
    res: Response
  ) => {
    const language: string = res.locals.language;
    const productID = req.params.productID;
    const options = { ...req.query };

    if (env.dev) console.log(productID, options);

    const product = await findProductByID({ language, productID, options });

    if (!product)
      throw new AppError({
        message: `Product with ID '${productID}' not found!`,
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
