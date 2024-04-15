import { FilterQuery, Model, Query, Types } from 'mongoose';
import { ProductDocument } from '../models/products/schemaDefs';

type APIFeaturesFunc = (params: {
  model: Model<ProductDocument>;
  reqQuery: {} | FilterQuery<ProductDocument>;
  findOptions: {
    [key: string]: Types.ObjectId; // key can be user id -> exp: find all products bought by user
  };
}) => Promise<ClsAPIFeatures>;

// Help refactor findAllProducts code -> /src/services/product.service.ts
const APIFeatures: APIFeaturesFunc = async ({
  model,
  reqQuery,
  findOptions = {},
}) => {
  // Actions like finding product that has price > 100
  const filterQuery = {
    ...JSON.parse(
      JSON.stringify({ ...reqQuery }).replace(
        /\b(gte?|lte?)\b/g,
        match => `$${match}`
      )
    ),
    ...findOptions,
  };

  const totalDocuments = await model.countDocuments(filterQuery);

  return new ClsAPIFeatures(model.find(), filterQuery, totalDocuments);
};

type ProductQuery = Query<ProductDocument[], ProductDocument>;
type ReqQuery = FilterQuery<ProductDocument>;

class ClsAPIFeatures {
  constructor(
    private query: ProductQuery,
    private filterQuery: ReqQuery,
    private totalDocuments: number
  ) {
    this.query = query;
    this.filterQuery = filterQuery;
    this.totalDocuments = totalDocuments;
  }

  private convertCond = (cond?: string | string[]) => {
    if (!cond) return;
    if (Array.isArray(cond)) return cond.join(' ');
    return cond.split(',').join(' ');
  };

  filter() {
    this.query = this.query.find(this.filterQuery);
    return this;
  }

  sort() {
    // _id' -> The order as in the database
    this.query = this.query.sort(
      this.convertCond(this.filterQuery.sort) || '_id'
    );

    return this;
  }

  project() {
    this.query = this.query.select(
      this.convertCond(this.filterQuery.fields) || '-__v'
    );

    return this;
  }

  paginate() {
    if (this.filterQuery.page || this.filterQuery.limit) {
      let page = Math.abs(Number.parseInt(this.filterQuery.page)) || 1;
      const limit = Math.abs(Number.parseInt(this.filterQuery.limit)) || 6;

      const pages = Math.ceil(this.totalDocuments / limit);
      if (page > pages) page = pages;

      this.query = this.query.skip((page - 1) * limit).limit(limit);
    }

    return this;
  }

  result = () => this.query;
}

export default APIFeatures;
