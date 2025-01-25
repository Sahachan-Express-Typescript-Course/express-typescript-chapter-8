import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.js';
import { container } from 'tsyringe';
import { asyncHandler } from '../../utils/handler.global.js';
import { authenticateToken } from './auth.middleware.js';

const authRouter = Router();
const authController = container.resolve(AuthController);

// public routes
authRouter.post('/login', asyncHandler(authController.login.bind(authController)));
authRouter.post('/register/staff', asyncHandler(authController.registerStaff.bind(authController)));
authRouter.post('/register/member', asyncHandler(authController.registerMember.bind(authController)));
authRouter.post('/refresh-token', asyncHandler(authController.refreshToken.bind(authController)));

// protected routes
authRouter.get('/me', authenticateToken, asyncHandler(authController.me.bind(authController)));
authRouter.post('/logout', authenticateToken, asyncHandler(authController.logout.bind(authController)));
authRouter.get('/logout-all', authenticateToken, asyncHandler(authController.revokeAllTokens.bind(authController)));

export { authRouter };
