import express from 'express';

import { getAllProducts, getProduct } from '../controllers/product.controller';
import validate from '../middleware/validateResource';
import { getProductSchema } from '../schemas/product.schema';

const productsRouter = express.Router();

productsRouter.route('/').get(getAllProducts);

productsRouter.get('/:productID', validate(getProductSchema), getProduct);

export default productsRouter;
