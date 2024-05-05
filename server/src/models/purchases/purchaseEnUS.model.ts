import mongoose from 'mongoose';

import { PurchaseDocument, schemaDefs, virtutalProperties } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<PurchaseDocument>(
  {
    ...schemaDefs,
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductEnUS',
      required: true,
    },
  },
  schemaSups
);

virtutalProperties(schema);

const PurchaseEnUS = mongoose.model<PurchaseDocument>(
  'PurchaseEnUS',
  schema,
  'purchaseEnUS'
);

export default PurchaseEnUS;
