import mongoose from 'mongoose';

import { ReviewDocument, populates, schemaDefs } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<ReviewDocument>(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductEnUS',
      required: true,
    },
    ...schemaDefs,
  },
  schemaSups
);

populates(schema);

const ReviewEnUS = mongoose.model<ReviewDocument>(
  'ReviewEnUS',
  schema,
  'reviewEnUS'
);

export default ReviewEnUS;
