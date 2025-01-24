import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.js';
import { container } from 'tsyringe';
import { asyncHandler } from '../../utils/handler.global.js';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post('/login', asyncHandler(authController.login.bind(authController)));
authRouter.post('/register', asyncHandler(authController.register.bind(authController)));
authRouter.get('/me', asyncHandler(authController.me.bind(authController)));

export { authRouter };
