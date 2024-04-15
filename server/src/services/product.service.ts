import { FilterQuery, Model, Types } from 'mongoose';

import ProductEnUS from '../models/products/productEnUs.model';
import ProductFR from '../models/products/productFr.model';
import { ProductDocument } from '../models/products/schemaDefs';
import APIFeatures from '../utils/apiFeatures';

type FindAllProducts = ({
  language,
  reqQuery,
  findOptions,
}: {
  language: string;
  reqQuery?: FilterQuery<ProductDocument>;
  findOptions?: {
    [key: string]: Types.ObjectId; // key can be user id -> exp: find all products bought by user
  };
}) => Promise<ProductDocument[]>;

export const findAllProducts: FindAllProducts = async ({
  language,
  reqQuery = {},
  findOptions = {},
}) => {
  let ProductModel: Model<ProductDocument> = ProductEnUS; // 'en-us'
  if (language === 'fr') ProductModel = ProductFR;

  const features = await APIFeatures({
    model: ProductModel,
    reqQuery,
    findOptions,
  });

  features.filter().sort().project().paginate();

  return features.result();
};
