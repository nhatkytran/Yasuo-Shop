import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import sendSuccess from '../utils/sendSuccess';
import { findUser } from '../services/user.service';
import { findProductByID } from '../services/product.service';

import {
  CheckoutSessionInput,
  CreatePurchaseInput,
  GetAllPurchasesInput,
  GetPurchaseInput,
  UpdatePurchaseInput,
} from '../schemas/purchase.schema';

import {
  createCheckoutSession,
  createPurchase,
  findAllPurchases,
  findAndDeletePurchase,
  findAndUpdatePurchase,
  findPurchaseByID,
} from '../services/purchase.service';

// Checkouts //////////

export const checkoutSession = catchAsync(
  async (req: Request<{}, {}, CheckoutSessionInput['body']>, res: Response) => {
    const language = res.locals.language as string;

    const session = await createCheckoutSession({
      language,
      customerEmail: res.locals.user.email,
      products: req.body.products,
    });

    sendSuccess(res, { language, session });
  }
);

// CRUD - Read //////////

export const checkGetAllPurchases = catchAsync(
  async (
    req: Request<GetAllPurchasesInput['params']>,
    res: Response,
    next: NextFunction
  ) => {
    const language = res.locals.language as string;
    const { userID, productID } = req.params;

    const findOptions: { user?: ObjectId; product?: ObjectId } = {};

    if (userID) {
      const user = await findUser({ query: { _id: userID } });

      findOptions.user = user._id;
    }

    if (productID) {
      const product = await findProductByID({ language, entityID: productID });

      findOptions.product = product._id;
    }

    res.locals.findOptions = findOptions;

    next();
  }
);

export const getAllPurchases = catchAsync(
  async (req: Request, res: Response) => {
    if (env.dev || env.test) console.log('req.query ->', req.query);

    const language = res.locals.language as string;
    const { findOptions } = res.locals;

    const purchases = await findAllPurchases({
      language,
      reqQuery: req.query,
      findOptions,
    });

    sendSuccess(res, { language, numResults: purchases.length, purchases });
  }
);

export const getPurchase = catchAsync(
  async (req: Request<GetPurchaseInput['params']>, res: Response) => {
    const language = res.locals.language as string;
    const { purchaseID } = req.params;
    const options = { ...req.query };

    if (env.dev || env.test) console.log(purchaseID, options);

    const purchase = await findPurchaseByID({
      language,
      entityID: purchaseID,
      options,
    });

    sendSuccess(res, { language, numResults: 1, purchase });
  }
);

// CRUD - Create //////////

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
      entityID: product,
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

// CRUD - Update //////////

export const updatePurchase = catchAsync(
  async (
    req: Request<GetPurchaseInput['params'], {}, UpdatePurchaseInput['body']>,
    res: Response
  ) => {
    const language = res.locals.language as string;

    const purchase = await findAndUpdatePurchase({
      language,
      entityID: req.params.purchaseID,
      update: req.body,
      options: { new: true, runValidators: true },
    });

    sendSuccess(res, { language, numResults: Number(!!purchase), purchase });
  }
);

// CRUD - Delete //////////

export const deleteAllPurchases = catchAsync(
  async (req: Request, res: Response) => {}
);

export const deletePurchase = catchAsync(
  async (req: Request<GetPurchaseInput['params']>, res: Response) => {
    const language: string = res.locals.language;
    const purchaseID: string = req.params.purchaseID;

    await findAndDeletePurchase({ language, entityID: purchaseID });

    sendSuccess(res, {
      statusCode: 204,
      language,
      numResults: 0,
      product: null,
    });
  }
);
