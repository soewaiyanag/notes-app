import { Router } from 'express';
import authRoutes from './auth.routes';
import noteRoutes from './note.routes';
import preferencesRoutes from './preferences.routes';
import tagRoutes from './tag.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/tags', tagRoutes);

export default router;
