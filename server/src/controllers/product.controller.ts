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

    const products = await findProductEditions(language);

    sendSuccess(res, { language, products });
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

// CRUD //////////

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    if (env.dev) console.log('req.query ->', req.query);

    const language: string = res.locals.language;

    const products = await findAllProducts({ language, reqQuery: req.query });

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

    const product = await findProductByID({ language, productID, options });

    sendSuccess(res, { language, numResults: 1, product });
  }
);

export const createNewProduct = catchAsync(
  async (req: Request<{}, {}, CreateProductInput['body']>, res: Response) => {
    const language: string = res.locals.language;
    const input = { ...req.body };

    const product = await createProduct({ language, input });

    sendSuccess(res, { statusCode: 201, language, numResults: 1, product });
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

    sendSuccess(res, { language, numResults: product ? 1 : 0, product });
  }
);

export const deleteProduct = catchAsync(
  async (req: Request<DeleteProductInput['params']>, res: Response) => {
    const language: string = res.locals.language;
    const productID: string = req.params.productID;

    await findAndDeleteProduct({ language, productID });

    sendSuccess(res, {
      statusCode: 204,
      language,
      numResults: 0,
      product: null,
    });
  }
);
