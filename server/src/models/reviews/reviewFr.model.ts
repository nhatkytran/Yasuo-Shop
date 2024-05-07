import mongoose from 'mongoose';

import {
  ReviewDocument,
  indexes,
  populates,
  postHooks,
  schemaDefs,
  staticMethods,
} from './schemaDefs';

import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<ReviewDocument>(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductFR',
      required: true,
    },
    ...schemaDefs,
  },
  schemaSups
);

indexes(schema);
populates(schema);
staticMethods(schema, 'fr');
postHooks(schema);

const ReviewFR = mongoose.model<ReviewDocument>('ReviewFR', schema, 'reviewFR');

export default ReviewFR;
