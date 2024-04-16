import { TypeOf, object, string, array, number, union, literal } from 'zod';

const payload = {
  body: object({
    name: string(),
    price: object({
      default: number(),
      saleAmount: number().optional(),
      currency: string().optional(),
    }),
    editions: object({
      en: array(
        union([
          literal('limited edition'),
          literal('preorder'),
          literal('special edition'),
        ])
      ),
      other: array(string()).optional(),
    }).optional(),
    images: array(string()),
    information: object({
      type: literal('figure')
        .or(literal('game'))
        .or(literal('cloth'))
        .or(literal('item')),
      category: literal('featured').or(literal('sale')),
      optional: object({ title: string(), image: string() }).optional(),
      sizes: array(string()).optional(),
      platforms: array(string()).optional(),
      regions: array(string()).optional(),
      check: string().optional(),
      warning: string().optional(),
      shippingDays: number().optional(),
      quote: string().optional(),
      descriptions: array(string().or(array(string()))), // Adapt based on your mongoose usage
      features: array(string()).optional(),
      approximateDimensions: object({
        value: array(array(number())),
        en: array(
          union([literal('height'), literal('width'), literal('depth')])
        ),
        other: array(string()).optional(),
      }).optional(),
      funFact: string().optional(),
      series: string().optional(),
      materials: array(string()).optional(),
    }),
  }),
};

const params = {
  params: object({
    productID: string({ required_error: `Product's ID is required` }),
  }),
};

export const createProductSchema = object({ ...payload });
export const getProductSchema = object({ ...params });

export type GetProductInput = TypeOf<typeof getProductSchema>;
export type CreateProductInput = TypeOf<typeof createProductSchema>;
