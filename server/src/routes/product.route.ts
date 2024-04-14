import express from 'express';

import { getAllProducts } from '../controllers/product.controller';

const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);

export default productsRouter;
