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
      ref: 'ProductEnUS',
      required: true,
    },
    ...schemaDefs,
  },
  schemaSups
);

indexes(schema);
populates(schema);
staticMethods(schema, 'en-us');
postHooks(schema);

const ReviewEnUS = mongoose.model<ReviewDocument>(
  'ReviewEnUS',
  schema,
  'reviewEnUS'
);

export default ReviewEnUS;
