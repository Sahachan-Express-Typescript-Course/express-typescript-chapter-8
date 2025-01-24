import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.js';
import { container } from 'tsyringe';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/me', authController.me);

export default authRouter;
