import express from 'express';
import morgan from 'morgan';
import path from 'path';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import config from 'config';

import routes from './routes/routes';
import trackLanguage from './middleware/trackLanguage';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/error.controller';
import env from './utils/env';

const init = () => {
  const app = express();

  // GET /route 304 9.789 ms - - -> Route information
  if (env.dev) app.use(morgan('dev'));

  // Config static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Parse data for req.body and multipart form
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Parse cookie
  app.use(cookieParser());

  // Set EJS as the view engine and set views directory
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

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
