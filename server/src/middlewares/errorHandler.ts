import type { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/BadRequestException';
import { HttpException } from '../exceptions/HttpException';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof BadRequestException) {
    res.status(err.statusCode).json({ message: err.message, errors: err.errors });
    return;
  }

  if (err instanceof HttpException) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
