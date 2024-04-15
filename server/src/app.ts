import express from 'express';
import morgan from 'morgan';
import path from 'path';
import hpp from 'hpp';
import config from 'config';

import routes from './routes/routes';
import trackLanguage from './middleware/trackLanguage';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import isDev from './utils/isDev';

const init = () => {
  const app = express();

  // GET /route 304 9.789 ms - - -> Route information
  if (isDev()) app.use(morgan('dev'));

  // Config static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Parse data for req.body and multipart form
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Prevent parameter polution
  app.use(hpp({ whitelist: config.get('parameterWhiteList') }));

  // Check query 'language', default: 'en-us'
  app.use(trackLanguage);

  // Routes: product, user,...
  routes(app);

  // Unhandled routes
  app.all('*', (req, _, next) =>
    next(
      new AppError({
        message: `${req.originalUrl} not found!`,
        statusCode: 404,
      })
    )
  );

  // Handle Global Error
  app.use(globalErrorHandler);

  return app;
};

export default init;
