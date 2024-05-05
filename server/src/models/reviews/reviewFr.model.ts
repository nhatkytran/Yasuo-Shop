import mongoose from 'mongoose';

import { ReviewDocument, schemaDefs } from './schemaDefs';
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

const ReviewFR = mongoose.model<ReviewDocument>('ReviewFR', schema, 'reviewFR');

export default ReviewFR;
