import express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';

// Config .env file -> process.env
dotenv.config({ path: path.join(__dirname, '../.env') });

import config from 'config';
import routes from './routes/routes';
import trackLanguage from './middleware/trackLanguage';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/error.controller';
import env from './utils/env';
import xssSanitize from './middleware/xssSanitize';
import { webhookCheckout } from './controllers/purchase.controller';

const init = () => {
  const app = express();

  // GET /route 304 9.789 ms - - -> Route information
  if (env.dev) app.use(morgan('dev'));

  // Set security HTTP Headers
  app.use(helmet());

  // Reduce fingerprinting
  app.disable('x-powered-by');

  // Config static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Stripe webhook checkout
  app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
  );

  // Parse data for req.body and multipart form
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Data sanitization against NoSQL query injection --> Dot or Dollar sign in MongoDB
  app.use(mongoSanitize());

  // Data sanitization against XSS --> Malicious code HTML,...
  app.use(xssSanitize);

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
