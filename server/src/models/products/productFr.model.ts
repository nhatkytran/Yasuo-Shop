import mongoose from 'mongoose';
import { ProductDocument, schemaDefs, schemaSups } from './schemaDefs';

const schema = new mongoose.Schema(schemaDefs, schemaSups);
const ProductFR = mongoose.model<ProductDocument>(
  'ProductFR',
  schema,
  'productFR'
);

export default ProductFR;
