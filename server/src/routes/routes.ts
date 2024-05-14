import { Express, Request, Response } from 'express';

import userRouter from './user.route';
import productsRouter from './product.route';
import sessionRouter from './session.route';
import purchaseRouter from './purchase.route';
import reviewRouter from './review.route';
import sendSuccess from '../utils/sendSuccess';

const routes = (app: Express) => {
  // Health check route
  app.get('/', (req: Request, res: Response) =>
    sendSuccess(res, {
      message:
        'This API is created by Trần Nhật Kỳ. Contact: nhockkutean2@gmail.com',
    })
  );

  // Current language
  app.get('/language', (_, res: Response) =>
    sendSuccess(res, { message: res.locals.language as string })
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
