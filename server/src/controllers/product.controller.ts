import { NextFunction, Request, Response } from 'express';
import { QueryOptions } from 'mongoose';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import sendSuccess from '../utils/sendSuccess';

import {
  calcProductStats,
  createProduct,
  findAllProducts,
  findAndDeleteProduct,
  findAndUpdateProduct,
  findProductByID,
  findProductEditions,
} from '../services/product.service';

import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from '../schemas/product.schema';

// ADVANCED //////////

export const getProductStats = catchAsync(
  async (req: Request, res: Response) => {
    const language: string = res.locals.language;

    const stats = await calcProductStats(language);

    sendSuccess(res, { language, stats });
  }
);

export const getProductEditions = catchAsync(
  async (req: Request, res: Response) => {
    const language: string = res.locals.language;

    const stas = await findProductEditions(language);

    sendSuccess(res, { language, stas });
  }
);

export const aliasTopProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';

  next();
};

// CRUD - Read //////////

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (env.dev || env.test) console.log('req.query ->', req.query);

    const language: string = res.locals.language;

    let findOptions: object = {};

    if (req.query.search) {
      const regex = new RegExp(req.query.search as string, 'i');

      findOptions = { name: { $regex: regex } };
    }

    const products = await findAllProducts({
      language,
      reqQuery: req.query,
      findOptions,
    });

    sendSuccess(res, { language, numResults: products.length, products });
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
    const { productID } = req.params;
    const options = { ...req.query };

    if (env.dev) console.log(productID, options);

    const product = await findProductByID({
      language,
      entityID: productID,
      options,
    });

    sendSuccess(res, { language, numResults: 1, product });
  }
);

// CRUD - Create //////////

export const createNewProduct = catchAsync(
  async (req: Request<{}, {}, CreateProductInput['body']>, res: Response) => {
    const language: string = res.locals.language;
    const input = { ...req.body };

    const product = await createProduct({ language, input });

    sendSuccess(res, { statusCode: 201, language, numResults: 1, product });
  }
);

// CRUD - Update //////////

export const updateProduct = catchAsync(
  async (
    req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
    res: Response
  ) => {
    const language: string = res.locals.language;

    const product = await findProductByID({
      language,
      entityID: req.params.productID,
    });

    const updatedProduct = await findAndUpdateProduct({
      language,
      entityID: product._id,
      update: req.body,
      options: { new: true, runValidators: true },
    });

    sendSuccess(res, { language, numResults: 1, product: updatedProduct });
  }
);

// CRUD - Delete //////////

export const deleteProduct = catchAsync(
  async (req: Request<DeleteProductInput['params']>, res: Response) => {
    const language: string = res.locals.language;

    const product = await findProductByID({
      language,
      entityID: req.params.productID,
    });

    await findAndDeleteProduct({ language, entityID: product._id });

    sendSuccess(res, { statusCode: 204 });
  }
);
