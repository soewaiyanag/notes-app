import type { Request, Response } from 'express';
import Controller from '../classes/Controller';
import PreferencesService from '../services/PreferencesService';
import { HTTP_STATUS } from '../constants/httpStatus';
import type { UpdatePreferencesBody } from '../schemas/preferences.schema';

export default class PreferencesController extends Controller {
  static async show(req: Request, res: Response): Promise<Response> {
    const preferences = await PreferencesService.get(req.userId!);
    return res.status(HTTP_STATUS.OK).json(preferences);
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const body = Controller.getValidatedBody<UpdatePreferencesBody>(req);
    const preferences = await PreferencesService.update(req.userId!, body);
    return res.status(HTTP_STATUS.OK).json(preferences);
  }
}
