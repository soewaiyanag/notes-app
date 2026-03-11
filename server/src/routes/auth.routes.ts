import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authSchemas } from '../schemas/auth.schema';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/register', validateRequest(authSchemas.register), AuthController.register);
router.post('/login', validateRequest(authSchemas.login), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

export default router;
