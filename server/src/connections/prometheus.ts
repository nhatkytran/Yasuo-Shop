import express from 'express';
import client from 'prom-client';
import logger from '../utils/logger';

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

// Check Database action like find product
export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success'],
});

const startMetricsServer = () => {
  client.collectDefaultMetrics();

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);

    return res.send(await client.register.metrics());
  });

  const port = 9100;

  app.listen(port, () =>
    logger.info(`Metrics server started at port ${port}...`)
  );
};

export default startMetricsServer;
