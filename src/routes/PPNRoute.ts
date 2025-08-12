import { Router } from 'express';
import { PPNController } from '../controllers/PPNController';
import { authMiddleware, roleMiddleware } from '../middlewares';
import { Role } from '@prisma/client';

export const ppnRoute: Router = Router();

ppnRoute.get('/', authMiddleware, PPNController.getCurrentPPN);
ppnRoute.patch(
  '/',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  PPNController.updatePPN,
);
