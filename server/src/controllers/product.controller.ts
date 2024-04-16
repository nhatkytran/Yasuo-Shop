import { Request, Response } from 'express';
import { QueryOptions } from 'mongoose';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import {
  createProduct,
  findAllProducts,
  findAndUpdateProduct,
  findProductByID,
} from '../services/product.service';
import {
  CreateProductInput,
  GetProductInput,
  UpdateProductInput,
} from '../schemas/product.schema';

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (env.dev) console.log('req.query ->', req.query);

    const language: string = res.locals.language;

    const products = await findAllProducts({ language, reqQuery: req.query });

    res.status(200).json({
      status: 'success',
      language,
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
      language,
      numResults: 1,
      product,
    });
  }
);

export const createNewProduct = catchAsync(
  async (req: Request<{}, {}, CreateProductInput['body']>, res: Response) => {
    const language: string = res.locals.language;
    const input = { ...req.body };

    const product = await createProduct({ language, input });

    res.status(200).json({
      status: 'success',
      language,
      numResults: 1,
      product,
    });
  }
);

export const updateProduct = catchAsync(
  async (
    req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
    res: Response
  ) => {
    const language: string = res.locals.language;
    const productID: string = req.params.productID;
    const update = { ...req.body };

    const product = await findAndUpdateProduct({
      language,
      productID,
      update,
      options: { new: true, runValidators: true },
    });

    res.status(200).json({
      status: 'success',
      language,
      numResults: product ? 1 : 0,
      product,
    });
  }
);
