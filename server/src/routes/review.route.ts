import express from 'express';

import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  createReviewSchema,
  getProductReviewsSchema,
  getReviewSchema,
  updateReviewSchema,
} from '../schemas/review.schema';

import {
  checkGetAllReviews,
  checkNewReview,
  createNewReview,
  getAllReviews,
  getProductReviews,
  updateReview,
} from '../controllers/review.controller';

const reviewRouter = express.Router({ mergeParams: true });

// api/v1/products/:productID/reviews/product-reviews
reviewRouter.get(
  '/product-reviews',
  validate(getProductReviewsSchema),
  getProductReviews
);

reviewRouter
  .route('/')
  // only admin can get all reviews, user can can only get reviews of their own
  .get(protect, checkGetAllReviews, getAllReviews)
  // only user that has already bought a product can review that product (only 1 review)
  .post(
    protect,
    restrictTo('user'),
    validate(createReviewSchema),
    checkNewReview,
    createNewReview
  );

reviewRouter
  .route('/:reviewID')
  .patch(
    protect,
    restrictTo('user'),
    validate(getReviewSchema),
    validate(updateReviewSchema),
    updateReview
  );

export default reviewRouter;
