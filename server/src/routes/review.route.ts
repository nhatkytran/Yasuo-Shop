import express from 'express';

import validate from '../middleware/validateResource';
import {
  createReviewSchema,
  getProductReviewsSchema,
} from '../schemas/review.schema';

import {
  checkNewReview,
  createNewReview,
  getProductReviews,
} from '../controllers/review.controller';
import { protect, restrictTo } from '../controllers/session.controller';

const reviewRouter = express.Router({ mergeParams: true });

// api/v1/products/:productID/reviews/product-reviews
reviewRouter.get(
  '/product-reviews',
  validate(getProductReviewsSchema),
  getProductReviews
);

reviewRouter
  .route('/')
  .post(
    protect,
    restrictTo('user'),
    validate(createReviewSchema),
    checkNewReview,
    createNewReview
  );

// reviewRouter
//   .route('/')
//   // admin get all reviews or specific reviews of product or user
//   // user can get all of their reviews or get specific reviews of a product
//   .get(checkGetAllReviews, getAllReviews);

export default reviewRouter;
