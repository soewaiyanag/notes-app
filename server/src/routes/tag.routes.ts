import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import TagController from '../controllers/TagController';

const router = Router();

router.use(authenticate);

router.get('/', TagController.index);

export default router;
