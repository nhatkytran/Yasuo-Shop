import express from 'express';

import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  checkGetAllPurchases,
  checkNewPurchase,
  createNewPurchase,
  getAllPurchases,
  getPurchase,
} from '../controllers/purchase.controller';

import {
  createPurchaseSchema,
  getAllPurchasesSchema,
} from '../schemas/purchase.schema';

const purchaseRouter = express.Router({ mergeParams: true });

purchaseRouter.use(protect);

// Checkout

purchaseRouter.use(restrictTo('admin'));

purchaseRouter
  .route('/')
  // get all purchases supports nested routes user and product
  .get(validate(getAllPurchasesSchema), checkGetAllPurchases, getAllPurchases)
  .post(validate(createPurchaseSchema), checkNewPurchase, createNewPurchase);

purchaseRouter.route('/:purchaseID').get(getPurchase);

export default purchaseRouter;
