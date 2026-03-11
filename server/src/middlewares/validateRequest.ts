import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestException } from '../exceptions/BadRequestException';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw new BadRequestException('Validation failed', result.error);
    }

    req.validated = {
      body: (result.data as Record<string, unknown>).body,
      query: (result.data as Record<string, unknown>).query,
      params: (result.data as Record<string, unknown>).params,
    };

    next();
  };
}
