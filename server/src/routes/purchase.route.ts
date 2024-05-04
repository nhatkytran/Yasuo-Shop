import express from 'express';

import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  checkGetAllPurchases,
  checkNewPurchase,
  createNewPurchase,
  deletePurchase,
  getAllPurchases,
  getPurchase,
  updatePurchase,
} from '../controllers/purchase.controller';

import {
  createPurchaseSchema,
  getAllPurchasesSchema,
  getPurchaseSchema,
  updatePurchaseSchema,
} from '../schemas/purchase.schema';

const purchaseRouter = express.Router({ mergeParams: true });

purchaseRouter.use(protect);

// Checkout

purchaseRouter.use(restrictTo('admin'));

purchaseRouter
  .route('/')
  .get(validate(getAllPurchasesSchema), checkGetAllPurchases, getAllPurchases)
  .post(validate(createPurchaseSchema), checkNewPurchase, createNewPurchase);

purchaseRouter
  .route('/:purchaseID')
  .get(validate(getPurchaseSchema), getPurchase)
  .patch(
    validate(getPurchaseSchema),
    validate(updatePurchaseSchema),
    updatePurchase
  )
  .delete(validate(getPurchaseSchema), deletePurchase);

export default purchaseRouter;
