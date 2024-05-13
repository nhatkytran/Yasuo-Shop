import { Express } from 'express';
import logger from './utils/logger';

// All errors happening in synchronous code -> nodejs process is in unclean state
process.on('uncaughtException', (error: any) => {
  logger.error(error, '--- UNCAUGHT EXCEPTION! Shutting down... ---');
  process.exit(1);
});

import init from './app'; // set .env file
import config from 'config';
import env from './utils/env';
import connectDatabase from './connections/database';
import startMetricsServer from './connections/prometheus';

// Run Express app
const app: Express = init();

// Server's port: 1337
const port = config.get<number>('port') || 1337;

// Run server
const server = app.listen(port, () => {
  logger.info(`App is running at port ${port}...`);

  // Connect MongoDB Cloud - Atlas
  connectDatabase();

  // Prometheus metrics
  if (env.dev) startMetricsServer();
});

// There is a promise that got rejected but it has not been handled
process.on('unhandledRejection', (error: any) => {
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
