import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validateRequest } from '../middlewares/validateRequest';
import { authSchemas } from '../schemas/auth.schema';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/register', validateRequest(authSchemas.register), AuthController.register);
router.post('/login', validateRequest(authSchemas.login), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', validateRequest(authSchemas.forgotPassword), AuthController.forgotPassword);
router.post('/reset-password', validateRequest(authSchemas.resetPassword), AuthController.resetPassword);
router.patch(
  '/password',
  authenticate,
  validateRequest(authSchemas.changePassword),
  AuthController.changePassword,
);

export default router;
