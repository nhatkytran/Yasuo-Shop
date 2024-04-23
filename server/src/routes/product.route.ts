import express from 'express';

import validate from '../middleware/validateResource';

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
import { protect, restrictTo } from '../controllers/session.controller';

const productsRouter = express.Router();

// ADVANCED //////////

productsRouter.get('/top-5-cheap', aliasTopProducts, getAllProducts);
productsRouter.get('/statsCategory', getProductStats);
productsRouter.get('/statsEditions', getProductEditions);

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
