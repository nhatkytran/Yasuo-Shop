import express from 'express';

import validate from '../middleware/validateResource';

import {
  createNewProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
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

// ADVANCED //////////

productsRouter.route('/stats').get(getProductStats);

// CRUD //////////

productsRouter
  .route('/')
  .get(getAllProducts)
  .post(validate(createProductSchema), createNewProduct);

productsRouter
  .route('/:productID')
  .get(validate(getProductSchema), getProduct)
  .patch(validate(updateProductSchema), updateProduct)
  .delete(validate(deleteProductSchema), deleteProduct);

export default productsRouter;
