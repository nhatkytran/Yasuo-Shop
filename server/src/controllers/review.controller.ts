import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';

import env from '../utils/env';
import catchAsync from '../utils/catchAsync';
import sendSuccess from '../utils/sendSuccess';
import { findProductByID } from '../services/product.service';

import {
  checkPurchaseExist,
  createReview,
  findAllReviews,
  findAndUpdateReview,
  findReview,
} from '../services/review.service';

import {
  CreateReviewInput,
  GetProductReviewsInput,
  GetReviewInput,
  UpdateReviewInput,
} from '../schemas/review.schema';

// CRUD - Read //////////

export const getProductReviews = catchAsync(
  async (req: Request<GetProductReviewsInput['params']>, res: Response) => {
    if (env.dev || env.test) console.log('req.query ->', req.query);

    const language = res.locals.language as string;
    const { productID } = req.params;

    const product = await findProductByID({ language, entityID: productID });

    const reviews = await findAllReviews({
      language,
      reqQuery: req.query,
      findOptions: { product: product._id },
    });

    sendSuccess(res, { language, numResults: reviews.length, reviews });
  }
);

export const checkGetAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;
    const findOptions: { user?: ObjectId } = {};

    console.log(user.role);

    if (user.role === 'user') findOptions.user = user._id;

    res.locals.findOptions = findOptions;

    next();
  }
);

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  if (env.dev || env.test) console.log('req.query ->', req.query);

  const language = res.locals.language as string;

  const reviews = await findAllReviews({
    language,
    reqQuery: req.query,
    findOptions: res.locals.findOptions,
  });

  sendSuccess(res, { language, numResults: reviews.length, reviews });
});

// CRUD - Create //////////

export const checkNewReview = catchAsync(
  async (
    req: Request<{}, {}, CreateReviewInput['body']>,
    res: Response,
    next: NextFunction
  ) => {
    const language = res.locals.language as string;
    const { product } = req.body;

    const targetProduct = await findProductByID({
      language,
      entityID: product,
    });

    await checkPurchaseExist({
      language,
      userID: res.locals.user._id.toString(),
      productID: product,
    });

    res.locals.product = targetProduct;

    next();
  }
);

export const createNewReview = catchAsync(
  async (req: Request<{}, {}, CreateReviewInput['body']>, res: Response) => {
    const { language, user, product } = res.locals;
    const input = { ...req.body, user: user._id, product: product._id };

    const review = await createReview({ language, input });

    sendSuccess(res, { statusCode: 201, language, numResults: 1, review });
  }
);

// CRUD - Update //////////

export const updateReview = catchAsync(
  async (
    req: Request<GetReviewInput['params'], {}, UpdateReviewInput['body']>,
    res: Response
  ) => {
    const language = res.locals.language as string;
    const { user } = res.locals;
    const { reviewID } = req.params;

    const review = await findReview({
      language,
      userID: user._id.toString(),
      reviewID,
    });

    const newReview = await findAndUpdateReview({
      language,
      entityID: review._id.toString(),
      update: req.body,
      options: { new: true, runValidators: true },
    });

    sendSuccess(res, {
      language,
      numResults: Number(!!newReview),
      review: newReview,
    });
  }
);
