import { Model } from 'mongoose';

import { CreateEntity, FindAllEntities } from './common.service';
import { ReviewDocument, ReviewInput } from '../models/reviews/schemaDefs';
import ReviewEnUS from '../models/reviews/reviewEnUS.model';
import ReviewFR from '../models/reviews/reviewFr.model';
import APIFeatures from '../utils/apiFeatures';
import { getPurchaseModel } from './purchase.service';
import AppError from '../utils/appError';

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

  return reviews.map(product => product.toJSON()) as ReviewDocument[];
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
