import { Request, Response, NextFunction } from "express";
import { logger } from "../Utils/Logger";

export function logRequestToFile(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url}`);
  res.on("finish", () => {
    logger.debug(`Response returned with status code: ${res.statusCode}`);
  });
  next();
}
