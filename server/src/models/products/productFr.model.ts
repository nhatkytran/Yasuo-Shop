import mongoose from 'mongoose';
import { schemaDefs, schemaSups } from './schemaDefs';

const schema = new mongoose.Schema(schemaDefs, schemaSups);
const ProductFR = mongoose.model('ProductFR', schema, 'productFR');

export default ProductFR;
