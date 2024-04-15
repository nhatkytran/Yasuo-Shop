import express from 'express';

import { getAllProducts, getProduct } from '../controllers/product.controller';

const productsRouter = express.Router();

productsRouter.route('/').get(getAllProducts);

productsRouter.route('/:id').get(getProduct);

export default productsRouter;
