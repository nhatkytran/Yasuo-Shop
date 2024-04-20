import mongoose from 'mongoose';

import { ProductDocument, schemaDefs, virtutalProperties } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<ProductDocument>(schemaDefs, schemaSups);

virtutalProperties(schema);

const ProductFR = mongoose.model<ProductDocument>(
  'ProductFR',
  schema,
  'productFR'
);

export default ProductFR;
