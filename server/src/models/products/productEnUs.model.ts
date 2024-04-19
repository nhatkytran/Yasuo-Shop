import mongoose from 'mongoose';

import {
  ProductDocument,
  schemaDefs,
  schemaSups,
  virtutalProperties,
} from './schemaDefs';

const schema = new mongoose.Schema<ProductDocument>(schemaDefs, schemaSups);

virtutalProperties(schema);

const ProductEnUS = mongoose.model<ProductDocument>(
  'ProductEnUS',
  schema,
  'productEnUS'
);

export default ProductEnUS;
