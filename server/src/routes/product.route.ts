import express from 'express';

import validate from '../middleware/validateResource';

import {
  createNewProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controllers/product.controller';

import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from '../schemas/product.schema';

const productsRouter = express.Router();

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
