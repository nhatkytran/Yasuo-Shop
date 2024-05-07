import { Model } from 'mongoose';

import { ReviewDocument, ReviewInput } from '../models/reviews/schemaDefs';
import ReviewEnUS from '../models/reviews/reviewEnUS.model';
import ReviewFR from '../models/reviews/reviewFr.model';
import APIFeatures from '../utils/apiFeatures';
import { getPurchaseModel } from './purchase.service';
import AppError from '../utils/appError';

import {
  CreateEntity,
  FindAllEntities,
  FindAndDeleteEntity,
  FindAndUpdateEntity,
} from './common.service';

// Helper functions //////////

const getReviewModel = (language: string): Model<ReviewDocument> => {
  let ReviewModel: Model<ReviewDocument> = ReviewEnUS; // 'en-us'
  if (language === 'fr') ReviewModel = ReviewFR;

  return ReviewModel;
};

// CRUD - Read //////////

export const findAllReviews: FindAllEntities<ReviewDocument> = async ({
  language,
  reqQuery = {},
  findOptions = {},
}) => {
  const ReviewModel = getReviewModel(language!);

  const options = { model: ReviewModel, reqQuery, findOptions };
  const features = await APIFeatures(options);

  features.filter().sort().project().paginate();

  const reviews = await features.result();

  return reviews.map(rev => {
    const review = rev.toJSON();

    delete review.product.price; // populate also gets virtual properties

    return review;
  }) as ReviewDocument[];
};

type FindReviewOptions = { language: string; reviewID: string; userID: string };

export const findReview = async ({
  language,
  reviewID,
  userID,
}: FindReviewOptions): Promise<ReviewDocument | never> => {
  const ReviewModel = getReviewModel(language);

  const review = await ReviewModel.findOne({ _id: reviewID, user: userID });

  if (!review)
    throw new AppError({ message: 'Review not found!', statusCode: 404 });

  return review;
};

// CRUD - Create //////////

type CheckUserPurchaseOptions = {
  language: string;
  userID: string;
  productID: string;
};

export const checkPurchaseExist = async ({
  language,
  userID,
  productID,
}: CheckUserPurchaseOptions) => {
  const PurchaseModel = getPurchaseModel(language);

  const purchase = await PurchaseModel.findOne({
    user: userID,
    product: productID,
  });

  if (!purchase)
    throw new AppError({
      message: "You haven't booked this item yet!",
      statusCode: 400,
    });
};

type CreateReview = CreateEntity<ReviewInput, ReviewDocument>;

export const createReview: CreateReview = async ({ language, input }) => {
  const ReviewModel = getReviewModel(language);

  const review = await ReviewModel.create(input);

  return review.toJSON() as ReviewDocument;
};

// CRUD - Update //////////

export const findAndUpdateReview: FindAndUpdateEntity<ReviewDocument> = async ({
  language,
  entityID,
  update,
  options,
}) => {
  const ReviewModel = getReviewModel(language);

  if (!update.hasOwnProperty('review') && !update.hasOwnProperty('rating'))
    throw new AppError({
      message: 'This route can only update < review > and < rating >!',
      statusCode: 400,
    });

  const newUpdate = Object.entries(update).reduce((acc, [field, value]) => {
    if (field === 'review' || field === 'rating') acc[field] = value;

    return acc;
  }, {} as { review?: string; rating?: number });

  const review = await ReviewModel.findByIdAndUpdate(
    entityID,
    newUpdate,
    options
  );

  if (!review) return null;
  return review.toJSON() as ReviewDocument;
};

// CRUD - Delete //////////

export const findAndDeleteReview: FindAndDeleteEntity = async ({
  language,
  entityID,
}) => {
  const ReviewModel = getReviewModel(language);

  await ReviewModel.findByIdAndDelete(entityID);
};
