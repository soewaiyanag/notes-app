import { ZodError } from 'zod';
import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  public readonly errors?: unknown;

  constructor(message = 'Bad request', zodError?: ZodError) {
    super(400, message);
    if (zodError) this.errors = zodError.flatten();
  }
}
