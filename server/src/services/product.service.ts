import { Model } from 'mongoose';

import APIFeatures from '../utils/apiFeatures';
import removeEmptyArray from '../utils/removeEmptyArray';
import AppError from '../utils/appError';
import ProductEnUS from '../models/products/productEnUs.model';
import ProductFR from '../models/products/productFr.model';
import { ProductDocument, ProductInput } from '../models/products/schemaDefs';
import { databaseResponseTimeHistogram } from '../connections/prometheus';

import {
  CreateEntity,
  FindAllEntities,
  FindAndDeleteEntity,
  FindAndUpdateEntity,
  FindEntityByID,
} from './common.service';

// Helper functions //////////

const getProductModel = (language: string): Model<ProductDocument> => {
  let ProductModel: Model<ProductDocument> = ProductEnUS; // 'en-us'
  if (language === 'fr') ProductModel = ProductFR;

  return ProductModel;
};

// ADVANCED //////////

interface Stats {
  _id: string;
  currency: string;
  numProducts: number;
  productID: string[];
  ratingsAverage: number;
  avgShippingDays: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgSaleAmount: number;
  minSaleAmount: number;
  maxSaleAmount: number;
  avgPriceAfterSale: number;
  minPriceAfterSale: number;
  maxPriceAfterSale: number;
}

const priceDefault = '$price.default';
const saleAmount = '$price.saleAmount';
const priceAlterSale = { $subtract: ['$price.default', '$price.saleAmount'] };

const statsGroupItems = {
  numProducts: { $sum: 1 },
  productID: { $push: '$_id' },
  ratingsAverage: { $sum: '$ratingsAverage' },
  avgShippingDays: { $avg: '$shippingDays' },
  avgPrice: { $avg: priceDefault },
  minPrice: { $min: priceDefault },
  maxPrice: { $max: priceDefault },
  avgSaleAmount: { $avg: saleAmount },
  minSaleAmount: { $min: saleAmount },
  maxSaleAmount: { $max: saleAmount },
  avgPriceAfterSale: { $avg: priceAlterSale },
  minPriceAfterSale: { $min: priceAlterSale },
  maxPriceAfterSale: { $max: priceAlterSale },
};

export const calcProductStats = async (language: string): Promise<Stats[]> => {
  const ProductModel = getProductModel(language);

  let currency: string = 'USD';
  if (language === 'fr') currency = 'EUR';

  return await ProductModel.aggregate<Stats>([
    { $match: {} }, // Match all documents
    { $group: { _id: { $toUpper: '$category' }, ...statsGroupItems } },
    { $addFields: { currency } },
    { $sort: { numProducts: 1, avgPrice: 1 } },
  ]);
};

export const findProductEditions = async (
  language: string
): Promise<Stats[]> => {
  const ProductModel = getProductModel(language);

  let currency: string = 'USD';
  if (language === 'fr') currency = 'EUR';

  let groupID: string = `$editions.${language === 'en-us' ? 'en' : 'other'}`;

  return await ProductModel.aggregate<Stats>([
    // preserveNullAndEmptyArrays: true
    // There are products that don't have any edition
    { $unwind: { path: groupID, preserveNullAndEmptyArrays: true } },
    { $group: { _id: { $toUpper: groupID }, ...statsGroupItems } },
    { $addFields: { currency } },
    { $sort: { numProducts: -1 } },
  ]);
};

// CRUD - Read //////////

export const findAllProducts: FindAllEntities<ProductDocument> = async ({
  language,
  reqQuery = {},
  findOptions = {},
}) => {
  const ProductModel = getProductModel(language!);

  const options = { model: ProductModel, reqQuery, findOptions };
  const features = await APIFeatures(options);

  features.filter().sort().project().paginate();

  const products = await features.result();

  return products.map(product =>
    removeEmptyArray(product.toJSON())
  ) as ProductDocument[];
};

export const findProductByID: FindEntityByID<ProductDocument> = async ({
  language,
  entityID,
  options = {},
}) => {
  const metricsLabels = { operation: 'findProductByID' };

  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const ProductModel = getProductModel(language);

    // { name: true, price.default: true,... } -> projecting
    let selectOptions: { [key: string]: true } = {};
    let { fields } = options;

    if (fields) {
      if (!Array.isArray(fields)) fields = fields.split(',');
      fields.forEach(field => (selectOptions[field] = true));
    }

    const product = await ProductModel.findById(entityID, selectOptions);

    if (!product)
      throw new AppError({ message: 'Product not found!', statusCode: 404 });

    const result = removeEmptyArray(product.toJSON()) as ProductDocument;

    timer({ ...metricsLabels, success: 'true' });

    return result;
  } catch (error: any) {
    timer({ ...metricsLabels, success: 'false' });

    throw error;
  }
};

// CRUD - Create //////////

type CreateProduct = CreateEntity<ProductInput, ProductDocument>;

export const createProduct: CreateProduct = async ({ language, input }) => {
  const ProductModel = getProductModel(language);

  const product = await ProductModel.create(input);

  return removeEmptyArray(product.toJSON()) as ProductDocument;
};

// CRUD - Update //////////

export const findAndUpdateProduct: FindAndUpdateEntity<
  ProductDocument
> = async ({ language, entityID, update, options }) => {
  const ProductModel = getProductModel(language);

  const product = await ProductModel.findByIdAndUpdate(
    entityID,
    update,
    options
  );

  if (!product) return null;
  return removeEmptyArray(product.toJSON()) as ProductDocument;
};

// CRUD - Delete //////////

export const findAndDeleteProduct: FindAndDeleteEntity = async ({
  language,
  entityID,
}) => {
  const ProductModel = getProductModel(language);

  await ProductModel.findByIdAndDelete(entityID);
};
