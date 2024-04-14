import { FilterQuery, Model, Query } from 'mongoose';

import ProductEnUS from '../models/products/productEnUs.model';
import ProductFR from '../models/products/productFr.model';
import { ProductDocument } from '../models/products/schemaDefs';

type FindFilter = {
  language: string;
  reqQuery?: FilterQuery<ProductDocument>;
};

type FindAllProducts = ({
  language,
  reqQuery,
}: FindFilter) => Promise<ProductDocument[]>;

export const findAllProducts: FindAllProducts = async ({
  language,
  reqQuery = {},
}: FindFilter) => {
  // 1. Advanced filtering
  const filterQuery = JSON.parse(
    JSON.stringify({ ...reqQuery }).replace(
      /\b(gte?|lte?)\b/g,
      match => `$${match}`
    )
  );

  // ! -> Tell TS that we assure that the value won't be undefined
  let query!: Query<ProductDocument[], ProductDocument>;

  let ProductModel;
  if (language === 'en-us') ProductModel = ProductEnUS;
  if (language === 'fr') ProductModel = ProductFR;

  query = ProductModel!.find(filterQuery);

  // 2. Sorting
  let sortCond: string = '_id'; // The order as in the database
  if (reqQuery.sort) sortCond = reqQuery.sort.split(',').join(' ');
  query = query.sort(sortCond);

  // 3. Field limiting - projecting
  let projectingFields = '-__v';
  if (reqQuery.fields) projectingFields = reqQuery.fields.split(',').join(' ');
  query = query.select(projectingFields);

  // 4. Pagination
  if (reqQuery.page || reqQuery.limit) {
    let page = Math.abs(Number.parseInt(reqQuery.page)) || 1;
    const limit = Math.abs(Number.parseInt(reqQuery.limit)) || 6;

    const totalDocuments = await ProductModel!.countDocuments(filterQuery);

    const pages = Math.ceil(totalDocuments / limit);
    if (page > pages) page = pages;

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
  }

  return query;
};
