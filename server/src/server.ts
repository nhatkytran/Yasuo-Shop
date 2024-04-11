import { Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

import config from "config";
import init from "./app";
import logger from "./utils/logger";
import connectDatabase from "./connections/database";

const { DATABASE } = process.env;

const app: Express = init();

const port = config.get<number>("port") || 1337;

app.listen(port, () => {
  logger.info(`App is running at port ${port}...`);

  // Connect MongoDB Cloud - Atlas
  connectDatabase();
});
