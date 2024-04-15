import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';

import ProductEnUS from '../models/products/productEnUs.model';
import ProductFR from '../models/products/productFr.model';
import { ProductDocument } from '../models/products/schemaDefs';
import APIFeatures from '../utils/apiFeatures';
import removeEmptyArray from '../utils/removeEmptyArray';

const getProductModel = (language: string): Model<ProductDocument> => {
  let ProductModel: Model<ProductDocument> = ProductEnUS; // 'en-us'
  if (language === 'fr') ProductModel = ProductFR;

  return ProductModel;
};

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
  const ProductModel = getProductModel(language);

  const features = await APIFeatures({
    model: ProductModel,
    reqQuery,
    findOptions,
  });

  features.filter().sort().project().paginate();

  const products = await features.result();

  return products.map(product =>
    removeEmptyArray(product.toJSON())
  ) as ProductDocument[];
};

// query: FilterQuery<ProductDocument>,
//   options: QueryOptions = { lean: true }

type FindProductByID = ({
  language,
  productID,
}: {
  language: string;
  productID: string;
  options?: QueryOptions;
}) => Promise<ProductDocument | null>;

export const findProductByID: FindProductByID = async ({
  language,
  productID,
  options = {}, // name: true, price: true,...
}) => {
  const ProductModel = getProductModel(language);

  const product = await ProductModel.findById(productID, options);

  if (!product) return null;
  return removeEmptyArray(product.toJSON()) as ProductDocument;
};
