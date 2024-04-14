import mongoose from 'mongoose';
import { ProductDocument, schemaDefs, schemaSups } from './schemaDefs';

const schema = new mongoose.Schema(schemaDefs, schemaSups);
const ProductEnUS = mongoose.model<ProductDocument>(
  'ProductEnUS',
  schema,
  'productEnUS'
);

export default ProductEnUS;
