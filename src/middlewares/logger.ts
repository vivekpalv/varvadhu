// src/middlewares/logger.middleware.ts
import { Request, Response, NextFunction } from "express";
import logger from "../config/logConfiguration";

// Request logger with response time, body, status, URL
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime(); // High-res start time

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // in ms

    logger.info(`[${req.method}] ${req.originalUrl} | status: ${res.statusCode} | response: ${responseTime} ms | body: ${JSON.stringify(req.body)}`);
  });

  next();
};

// Error-handling middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error processing request: [${req.method}] ${req.originalUrl} - ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: "Internal Server Error" });
};
