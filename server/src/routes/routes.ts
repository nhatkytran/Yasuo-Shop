import { Express, Request, Response } from "express";

const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) =>
    res.status(200).json({ status: "success" })
  );
};

export default routes;
