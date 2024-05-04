import { TypeOf, number, object, string } from 'zod';

export const getAllPurchasesSchema = object({
  params: object({
    userID: string().optional(),
    productID: string().optional(),
  }),
});

export const createPurchaseSchema = object({
  body: object({
    user: string(),
    product: string(),
    quantity: number().int().min(1),
    price: number().gte(0),
  }),
});

export type GetAllPurchasesInput = TypeOf<typeof getAllPurchasesSchema>;
export type CreatePurchaseInput = TypeOf<typeof createPurchaseSchema>;
