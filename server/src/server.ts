import logger from './utils/logger';

// All errors happening in synchronous code -> nodejs process is in unclean state
process.on('uncaughtException', error => {
  logger.error(error, '--- UNCAUGHT EXCEPTION! Shutting down... ---');
  process.exit(1);
});

import { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Config .env file -> process.env
dotenv.config({ path: path.join(__dirname, '../.env') });

import config from 'config';
import init from './app';
import connectDatabase from './connections/database';
import env from './utils/env';

// Run Express app
const app: Express = init();

// Run server at port 1337
const port = config.get<number>('port') || 1337;
const server = app.listen(port, () => {
  logger.info(`App is running at port ${port}...`);

  // Connect MongoDB Cloud - Atlas
  connectDatabase();
});

// There is a promise that got rejected but it has not been handled
process.on('unhandledRejection', error => {
  logger.error(error, '--- UNHANDLED REJECTION! Shutting down... ---');
  // number 0 -> exit after success
  // number 1 -> some kind of error and give more information about it
  server.close(() => process.exit(1));
});

// In dev mode, SIGTERM is triggered maybe because of ts-node-dev
if (env.prod)
  // The NodeJS process is killed
  process.on('SIGTERM', () => {
    logger.info('--- SIGTERM RECEIVED! Shutting down... ---');
    if (server)
      server.close(() => logger.info('SIGTERM - Process terminated!'));
  });
