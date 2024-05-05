import express from 'express';

import purchaseRouter from './purchase.route';
import reviewRouter from './review.route';
import validate from '../middleware/validateResource';
import { protect, restrictTo } from '../controllers/session.controller';

import {
  aliasTopProducts,
  createNewProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductEditions,
  getProductStats,
  updateProduct,
} from '../controllers/product.controller';

import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from '../schemas/product.schema';

const productsRouter = express.Router();

// Actions for purchases of product
productsRouter.use('/:productID/purchases', purchaseRouter);

// Actions for reviews of priduct
productsRouter.use('/:productID/reviews', reviewRouter);

// ADVANCED //////////

productsRouter.get('/top-5-cheap', aliasTopProducts, getAllProducts);

productsRouter.get(
  '/stats-category',
  protect,
  restrictTo('admin'),
  getProductStats
);

productsRouter.get(
  '/stats-editions',
  protect,
  restrictTo('admin'),
  getProductEditions
);

// CRUD //////////

productsRouter
  .route('/')
  .get(getAllProducts)
  .post(
    protect,
    restrictTo('admin'),
    validate(createProductSchema),
    createNewProduct
  );

productsRouter
  .route('/:productID')
  .get(validate(getProductSchema), getProduct)
  .patch(
    protect,
    restrictTo('admin'),
    validate(updateProductSchema),
    updateProduct
  )
  .delete(
    protect,
    restrictTo('admin'),
    validate(deleteProductSchema),
    deleteProduct
  );

export default productsRouter;
