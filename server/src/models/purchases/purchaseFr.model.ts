import mongoose from 'mongoose';

import { PurchaseDocument, schemaDefs } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<PurchaseDocument>(
  {
    ...schemaDefs,
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductFR',
      required: true,
    },
  },
  schemaSups
);

const PurchaseFR = mongoose.model<PurchaseDocument>(
  'PurchaseFR',
  schema,
  'purchaseFR'
);

export default PurchaseFR;
