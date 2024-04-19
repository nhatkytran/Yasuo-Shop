import mongoose from 'mongoose';

import {
  ProductDocument,
  schemaDefs,
  schemaSups,
  virtutalProperties,
} from './schemaDefs';

const schema = new mongoose.Schema<ProductDocument>(schemaDefs, schemaSups);

virtutalProperties(schema);

const ProductFR = mongoose.model<ProductDocument>(
  'ProductFR',
  schema,
  'productFR'
);

export default ProductFR;
