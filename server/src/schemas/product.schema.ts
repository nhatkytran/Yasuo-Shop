import { TypeOf, object, string } from 'zod';

const params = {
  params: object({
    productID: string({ required_error: `Product's ID is required` }),
  }),
};

export const getProductSchema = object({ ...params });

export type GetProductInput = TypeOf<typeof getProductSchema>;
