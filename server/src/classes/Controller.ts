import type { Request } from 'express';

export default class Controller {
  protected static getValidatedBody<T>(req: Request): T {
    return req.validated.body as T;
  }

  protected static getValidatedQuery<T>(req: Request): T {
    return req.validated.query as T;
  }

  protected static getValidatedParams<T>(req: Request): T {
    return req.validated.params as T;
  }
}
