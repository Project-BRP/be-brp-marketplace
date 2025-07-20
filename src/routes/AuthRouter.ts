import { Router } from 'express';

import { Role } from '../constants';
import { AuthController } from '../controllers';
import {
  authMiddleware,
  RateLimiter,
  roleMiddleware,
  uploadMiddleware,
} from '../middlewares';

export const authRoute: Router = Router();

authRoute.post(
  '/register',
  RateLimiter.registerLimiter,
  AuthController.register,
);
authRoute.post(
  '/verify-email/:token',
  RateLimiter.verifyEmailLimiter,
  AuthController.verifyEmail,
);
authRoute.post('/login', RateLimiter.loginLimiter, AuthController.login);
authRoute.post('/logout', authMiddleware, AuthController.logout);
authRoute.get('/users/me', authMiddleware, AuthController.getUser);
authRoute.get(
  '/users',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  AuthController.getAllUsers,
);

authRoute.patch(
  '/users/me',
  authMiddleware,
  uploadMiddleware,
  AuthController.updateUser,
);
authRoute.delete('/users/me', authMiddleware, AuthController.deleteUser);
authRoute.post(
  '/forgot-password',
  RateLimiter.forgotPasswordLimiter,
  AuthController.forgotPassword,
);
authRoute.post('/check-reset-token', AuthController.checkResetToken);
authRoute.post(
  '/reset-password',
  RateLimiter.resetPasswordLimiter,
  AuthController.resetPassword,
);
