import { TypeOf, number, object, string } from 'zod';

export const getProductReviewsSchema = object({
  params: object({ productID: string() }),
});

export const getReviewSchema = object({
  params: object({ reviewID: string() }),
});

export const createReviewSchema = object({
  body: object({
    product: string(),
    review: string().max(300),
    rating: number().min(1).max(5),
  }),
});

export const updateReviewSchema = object({
  body: object({ review: string().optional(), rating: number().optional() }),
});

export type GetProductReviewsInput = TypeOf<typeof getProductReviewsSchema>;
export type GetReviewInput = TypeOf<typeof getReviewSchema>;
export type CreateReviewInput = TypeOf<typeof createReviewSchema>;
export type UpdateReviewInput = TypeOf<typeof updateReviewSchema>;
