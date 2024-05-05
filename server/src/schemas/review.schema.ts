import { TypeOf, number, object, string } from 'zod';

export const getProductReviewsSchema = object({
  params: object({ productID: string() }),
});

export const createReviewSchema = object({
  body: object({
    product: string(),
    review: string().max(300),
    rating: number().min(1).max(5),
  }),
});

export type GetProductReviewsInput = TypeOf<typeof getProductReviewsSchema>;
export type CreateReviewInput = TypeOf<typeof createReviewSchema>;
