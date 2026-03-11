import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing access token');
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as unknown as { sub: number };
    req.userId = payload.sub;
    next();
  } catch {
    throw new UnauthorizedException('Invalid or expired access token');
  }
}
