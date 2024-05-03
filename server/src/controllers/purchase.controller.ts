import { NextFunction, Request, Response } from 'express';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import sendSuccess from '../utils/sendSuccess';
import { findUser } from '../services/user.service';
import { findProductByID } from '../services/product.service';
import { CreatePurchaseInput } from '../schemas/purchase.schema';
import { createPurchase } from '../services/purchase.service';

// Find a specific purchase and all purchases //////////

export const checkGetAllPurchases = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userID, productID } = req.params;
  const filterOptions: { userID?: string; productID?: string } = {};

  if (userID) filterOptions.userID = userID;
  if (productID) filterOptions.productID = productID;

  res.locals.fitlerOptions = filterOptions;

  next();
};

export const getAllPurchases = catchAsync(
  async (req: Request, res: Response) => {
    if (env.dev || env.test) console.log('req.query ->', req.query);

    const language = res.locals.language as string;

    sendSuccess(res, {});
  }
);

// Create purchase - admin //////////

export const checkNewPurchase = catchAsync(
  async (
    req: Request<{}, {}, CreatePurchaseInput['body']>,
    res: Response,
    next: NextFunction
  ) => {
    const { user, product } = req.body;

    const targetUser = await findUser({ query: { _id: user } });

    const targetProduct = await findProductByID({
      language: res.locals.language as string,
      productID: product,
    });

    res.locals.user = targetUser;
    res.locals.product = targetProduct;

    next();
  }
);

export const createNewPurchase = catchAsync(
  async (req: Request<{}, {}, CreatePurchaseInput['body']>, res: Response) => {
    const language = res.locals.language as string;

    const purchase = await createPurchase({
      language,
      input: {
        ...req.body,
        user: res.locals.user._id,
        product: res.locals.product._id,
      },
    });

    sendSuccess(res, { statusCode: 201, language, numResults: 1, purchase });
  }
);
