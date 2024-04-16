import { TypeOf, object, string, array, number, union, literal } from 'zod';

const payloadOptional = {
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
  optional: object({ title: string(), image: string() }).optional(),
  sizes: array(string()).optional(),
  platforms: array(string()).optional(),
  regions: array(string()).optional(),
  check: string().optional(),
  warning: string().optional(),
  shippingDays: number().optional(),
  quote: string().optional(),
  features: array(string()).optional(),
  approximateDimensions: object({
    value: array(array(number())),
    en: array(union([literal('height'), literal('width'), literal('depth')])),
    other: array(string()).optional(),
  }).optional(),
  funFact: string().optional(),
  series: string().optional(),
  materials: array(string()).optional(),
};

const Name = string();
const Price = object({
  default: number(),
  saleAmount: number().optional(),
  currency: string().optional(),
});
const Images = array(string());
const Type = literal('figure')
  .or(literal('game'))
  .or(literal('cloth'))
  .or(literal('item'));
const Category = literal('featured').or(literal('sale'));
const Descriptions = array(string().or(array(string())));

const params = {
  params: object({
    productID: string({ required_error: `Product's ID is required` }),
  }),
};

export const createProductSchema = object({
  body: object({
    name: Name,
    price: Price,
    images: Images,
    type: Type,
    category: Category,
    descriptions: Descriptions,
    ...payloadOptional,
  }),
});

export const getProductSchema = object({ ...params });

export const updateProductSchema = object({
  ...params,
  body: object({
    name: Name.optional(),
    price: Price.optional(),
    images: Images.optional(),
    type: Type.optional(),
    category: Category.optional(),
    descriptions: Descriptions.optional(),
    ...payloadOptional,
  }),
});

export type GetProductInput = TypeOf<typeof getProductSchema>;
export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
