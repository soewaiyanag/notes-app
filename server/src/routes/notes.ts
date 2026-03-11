import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as notesController from '../controllers/notes';

const router = Router();

router.use(authenticate);

router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.get('/:id', notesController.getNote);
router.patch('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.patch('/:id/archive', notesController.toggleArchive);

export default router;
