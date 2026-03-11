import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { noteSchemas } from '../schemas/note.schema';
import NoteController from '../controllers/NoteController';

const router = Router();

router.use(authenticate);

router.get('/', validateRequest(noteSchemas.list), NoteController.index);
router.post('/', validateRequest(noteSchemas.create), NoteController.store);
router.get('/:id', validateRequest(noteSchemas.idParam), NoteController.show);
router.patch('/:id', validateRequest(noteSchemas.update), NoteController.update);
router.delete('/:id', validateRequest(noteSchemas.idParam), NoteController.destroy);
router.patch('/:id/archive', validateRequest(noteSchemas.idParam), NoteController.archive);

export default router;
