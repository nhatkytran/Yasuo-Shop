const mongoose = require('mongoose');
import config from 'config';

import logger from '../utils/logger';

const connectDatabase = async () => {
  await mongoose
    .set('strictQuery', true)
    .connect(config.get<string>('databaseURL'));

  logger.info('Database connection - Successful!');
};

export default connectDatabase;
