import { TypeOf, boolean, number, object, string } from 'zod';

export const getAllPurchasesSchema = object({
  params: object({
    userID: string().optional(),
    productID: string().optional(),
  }),
});

export const getPurchaseSchema = object({
  params: object({ purchaseID: string() }),
});

export const createPurchaseSchema = object({
  body: object({
    user: string(),
    product: string(),
    quantity: number().int().min(1),
    price: number().gte(0),
  }),
});

export const updatePurchaseSchema = object({
  body: object({
    user: string().optional(),
    product: string().optional(),
    quantity: number().int().min(1).optional(),
    price: number().gte(0).optional(),
    paid: boolean().optional(),
    shipped: boolean().optional(),
  }),
});

export type GetAllPurchasesInput = TypeOf<typeof getAllPurchasesSchema>;
export type GetPurchaseInput = TypeOf<typeof getPurchaseSchema>;
export type CreatePurchaseInput = TypeOf<typeof createPurchaseSchema>;
export type UpdatePurchaseInput = TypeOf<typeof updatePurchaseSchema>;
