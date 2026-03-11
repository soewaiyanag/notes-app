import type { Request, Response } from 'express';
import Controller from '../classes/Controller';
import NoteService from '../services/NoteService';
import { HTTP_STATUS } from '../constants/httpStatus';
import type { CreateNoteBody, UpdateNoteBody, NoteListQuery, NoteIdParam } from '../schemas/note.schema';

export default class NoteController extends Controller {
  static async index(req: Request, res: Response): Promise<Response> {
    const query = Controller.getValidatedQuery<NoteListQuery>(req);
    const notes = await NoteService.list(req.userId!, query ?? {});
    return res.status(HTTP_STATUS.OK).json(notes);
  }

  static async show(req: Request, res: Response): Promise<Response> {
    const { id } = Controller.getValidatedParams<NoteIdParam>(req);
    const note = await NoteService.getById(Number(id), req.userId!);
    return res.status(HTTP_STATUS.OK).json(note);
  }

  static async store(req: Request, res: Response): Promise<Response> {
    const body = Controller.getValidatedBody<CreateNoteBody>(req);
    const note = await NoteService.create(req.userId!, body);
    return res.status(HTTP_STATUS.CREATED).json(note);
  }

  static async update(req: Request, res: Response): Promise<Response> {
    const { id } = Controller.getValidatedParams<NoteIdParam>(req);
    const body = Controller.getValidatedBody<UpdateNoteBody>(req);
    const note = await NoteService.update(Number(id), req.userId!, body);
    return res.status(HTTP_STATUS.OK).json(note);
  }

  static async destroy(req: Request, res: Response): Promise<Response> {
    const { id } = Controller.getValidatedParams<NoteIdParam>(req);
    await NoteService.delete(Number(id), req.userId!);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  static async archive(req: Request, res: Response): Promise<Response> {
    const { id } = Controller.getValidatedParams<NoteIdParam>(req);
    const note = await NoteService.toggleArchive(Number(id), req.userId!);
    return res.status(HTTP_STATUS.OK).json(note);
  }
}
