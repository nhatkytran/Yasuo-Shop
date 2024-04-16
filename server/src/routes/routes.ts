import { Express, Request, Response } from 'express';

import productsRouter from './product.route';

const routes = (app: Express) => {
  app.get('/', (req: Request, res: Response) =>
    res.status(200).json({
      status: 'success',
      message: `This API is created by Trần Nhật Kỳ. Contact: nhockkutean2@gmail.com`,
    })
  );

  app.use('/api/v1/products', productsRouter);
};

export default routes;
