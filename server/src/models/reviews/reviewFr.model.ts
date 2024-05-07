import mongoose from 'mongoose';

import { ReviewDocument, populates, schemaDefs } from './schemaDefs';
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

populates(schema);

const ReviewFR = mongoose.model<ReviewDocument>('ReviewFR', schema, 'reviewFR');

export default ReviewFR;
