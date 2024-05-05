import mongoose from 'mongoose';

import { PurchaseDocument, schemaDefs, virtutalProperties } from './schemaDefs';
import { schemaSups } from '../commonDefs';

const schema = new mongoose.Schema<PurchaseDocument>(
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

virtutalProperties(schema);

const PurchaseFR = mongoose.model<PurchaseDocument>(
  'PurchaseFR',
  schema,
  'purchaseFR'
);

export default PurchaseFR;
