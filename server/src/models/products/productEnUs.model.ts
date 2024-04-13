import mongoose from 'mongoose';
import { schemaDefs, schemaSups } from './schemaDefs';

const schema = new mongoose.Schema(schemaDefs, schemaSups);
const ProductEnUS = mongoose.model('ProductEnUS', schema, 'productEnUS');

export default ProductEnUS;
