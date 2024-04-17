import { Express, Request, Response } from 'express';

import userRouter from './user.route';
import productsRouter from './product.route';

const routes = (app: Express) => {
  // Health check route
  app.get('/', (req: Request, res: Response) =>
    res.status(200).json({
      status: 'success',
      message: `This API is created by Trần Nhật Kỳ. Contact: nhockkutean2@gmail.com`,
    })
  );

  // Users, Authentication, Authorization,...
  app.use('/api/v1/users', userRouter);

  // Products -> stats, crud,...
  app.use('/api/v1/products', productsRouter);
};

export default routes;
