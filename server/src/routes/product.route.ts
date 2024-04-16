import express from 'express';

import {
  createNewProduct,
  getAllProducts,
  getProduct,
} from '../controllers/product.controller';
import validate from '../middleware/validateResource';
import {
  createProductSchema,
  getProductSchema,
} from '../schemas/product.schema';

const productsRouter = express.Router();

productsRouter
  .route('/')
  .get(getAllProducts)
  .post(validate(createProductSchema), createNewProduct);

productsRouter.get('/:productID', validate(getProductSchema), getProduct);

export default productsRouter;
