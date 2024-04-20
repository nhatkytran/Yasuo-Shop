import mongoose from 'mongoose';

import { ProductDocument, schemaDefs, virtutalProperties } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<ProductDocument>(schemaDefs, schemaSups);

virtutalProperties(schema);

const ProductEnUS = mongoose.model<ProductDocument>(
  'ProductEnUS',
  schema,
  'productEnUS'
);

export default ProductEnUS;
