import { Request, Response, NextFunction } from "express";
import { logger } from "../Utils/Logger";

// This handler is reached only for unexpected errors that were not caught elsewhere
export function errorHandler(err: any, _req: Request, res: Response, next: NextFunction) {
  logger.error(`Error: ${err.message || err}`);
  // Avoid leaking internal error details to the client
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({ error: isProd ? 'Internal server error' : err.message });
}
