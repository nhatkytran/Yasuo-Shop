const mongoose = require("mongoose");
import config from "config";

import logger from "../utils/logger";

const connectDatabase = async () => {
  try {
    await mongoose
      .set("strictQuery", true)
      .connect(config.get<string>("databaseURL"));

    logger.info("Database connection - Successful!");
  } catch (error) {
    logger.error(error, "Database connection - Failed!");
  }
};

export default connectDatabase;
