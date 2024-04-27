import express from 'express';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
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

  // Set security HTTP Headers
  app.use(helmet());

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

  // Compress data before sending to user
  if (env.prod) app.use(compression());

  // Cors -> allows all users to get access to APIs
  app.use(cors());
  app.options('*', cors());

  // Use IP address of client not IP address of Proxy
  app.enable('trust proxy');

  // Limit requests from same IP adresses
  app.use(
    '/',
    rateLimit({
      max: 1000,
      windowMs: 60 * 60 * 1000,
      message: 'Too many requests from this IP! Please try again in an hour.',
      validate: { trustProxy: false }, // proxy can modify client IP address in header
    })
  );

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
