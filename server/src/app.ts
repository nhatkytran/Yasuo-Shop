import express from "express";
import morgan from "morgan";

import routes from "./routes/routes";

const { NODE_ENV } = process.env;

const init = () => {
  const app = express();

  // GET /route 304 9.789 ms - - -> Route information
  if (NODE_ENV === "development") app.use(morgan("dev"));

  // Parse data for req.body and multipart form
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  routes(app);

  return app;
};

export default init;
