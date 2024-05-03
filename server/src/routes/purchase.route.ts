import express from 'express';

import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  checkNewPurchase,
  createNewPurchase,
} from '../controllers/purchase.controller';
import { createPurchaseSchema } from '../schemas/purchase.schema';

const purchaseRouter = express.Router();

purchaseRouter.use(protect);

// Checkout

purchaseRouter.use(restrictTo('admin'));

purchaseRouter
  .route('/')
  .post(validate(createPurchaseSchema), checkNewPurchase, createNewPurchase);

export default purchaseRouter;
