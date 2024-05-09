import { Express, Request, Response } from 'express';

import userRouter from './user.route';
import productsRouter from './product.route';
import sessionRouter from './session.route';
import purchaseRouter from './purchase.route';
import reviewRouter from './review.route';

const routes = (app: Express) => {
  // Hello World
  app.get('/hello-world', (_, res: Response) => res.send('Hello World!'));

  // Health check route
  app.get('/', (req: Request, res: Response) =>
    res.status(200).json({
      status: 'success',
      message:
        'This API is created by Trần Nhật Kỳ. Contact: nhockkutean2@gmail.com',
    })
  );

  // Users, Signup, Update password,...
  app.use('/api/v1/users', userRouter);

  // Signin, Authorization,...
  app.use('/api/v1/sessions', sessionRouter);

  // Products -> stats, crud,...
  app.use('/api/v1/products', productsRouter);

  // Purchases -> crud, stripe payment,...
  app.use('/api/v1/purchases', purchaseRouter);

  // Reviews -> crud,...
  app.use('/api/v1/reviews', reviewRouter);
};

export default routes;
