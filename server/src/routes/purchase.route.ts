import express from 'express';

import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  checkGetAllPurchases,
  checkNewPurchase,
  checkoutSession,
  createNewPurchase,
  deletePurchase,
  getAllPurchases,
  getPurchase,
  updatePurchase,
} from '../controllers/purchase.controller';

import {
  checkoutSessionSchema,
  createPurchaseSchema,
  getAllPurchasesSchema,
  getPurchaseSchema,
  updatePurchaseSchema,
} from '../schemas/purchase.schema';

const purchaseRouter = express.Router({ mergeParams: true });

purchaseRouter.use(protect);

purchaseRouter.post(
  '/checkout-session',
  validate(checkoutSessionSchema),
  checkoutSession
);

// user get all purchases of their own
purchaseRouter.get(
  '/user-purchases',
  restrictTo('user'),
  checkGetAllPurchases,
  getAllPurchases
);

purchaseRouter.use(restrictTo('admin'));

purchaseRouter
  .route('/')
  // admin get all purchases (all | user | product)
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
