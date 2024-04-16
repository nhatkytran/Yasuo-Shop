import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';

import ProductEnUS from '../models/products/productEnUs.model';
import ProductFR from '../models/products/productFr.model';
import { ProductDocument, ProductInput } from '../models/products/schemaDefs';
import APIFeatures from '../utils/apiFeatures';
import removeEmptyArray from '../utils/removeEmptyArray';

const getProductModel = (language: string): Model<ProductDocument> => {
  if (!language) throw new Error('DevError: No language provided!');

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

interface FindProductByIDOptions extends QueryOptions {
  fields?: string | string[];
}

type FindProductByID = ({
  language,
  productID,
}: {
  language: string;
  productID: string;
  options?: FindProductByIDOptions;
}) => Promise<ProductDocument | null>;

export const findProductByID: FindProductByID = async ({
  language,
  productID,
  options = {},
}) => {
  const ProductModel = getProductModel(language);

  // { name: true, price.default: true,... } -> projecting
  let selectOptions: { [key: string]: true } = {};
  let { fields } = options;

  if (fields) {
    if (!Array.isArray(fields)) fields = fields.split(',');
    fields.forEach(field => (selectOptions[field] = true));
  }

  const product = await ProductModel.findById(productID, selectOptions);

  if (!product) return null;
  return removeEmptyArray(product.toJSON()) as ProductDocument;
};

type CreateProduct = ({
  input,
}: {
  language: string;
  input: ProductInput;
}) => Promise<ProductDocument>;

export const createProduct: CreateProduct = async ({ language, input }) => {
  const ProductModel = getProductModel(language);

  const product = await ProductModel.create(input);

  return removeEmptyArray(product.toJSON()) as ProductDocument;
};

type FindAndUpdateProduct = ({
  language,
  productID,
  update,
  options,
}: {
  language: string;
  productID: string;
  update: UpdateQuery<ProductDocument>;
  options: QueryOptions;
}) => Promise<ProductDocument | null>;

export const findAndUpdateProduct: FindAndUpdateProduct = async ({
  language,
  productID,
  update,
  options,
}) => {
  const ProductModel = getProductModel(language);

  const product = await ProductModel.findByIdAndUpdate(
    productID,
    update,
    options
  );

  if (!product) return null;
  return removeEmptyArray(product.toJSON()) as ProductDocument;
};
