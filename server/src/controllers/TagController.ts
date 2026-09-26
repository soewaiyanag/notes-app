import type { Request, Response } from 'express';
import Controller from '../classes/Controller';
import TagService from '../services/TagService';
import { HTTP_STATUS } from '../constants/httpStatus';

export default class TagController extends Controller {
  static async index(req: Request, res: Response): Promise<Response> {
    const tags = await TagService.list(req.userId!);
    return res.status(HTTP_STATUS.OK).json(tags);
  }
}
