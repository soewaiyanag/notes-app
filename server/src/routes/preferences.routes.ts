import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { preferencesSchemas } from '../schemas/preferences.schema';
import PreferencesController from '../controllers/PreferencesController';

const router = Router();

router.use(authenticate);

router.get('/', PreferencesController.show);
router.patch('/', validateRequest(preferencesSchemas.update), PreferencesController.update);

export default router;
