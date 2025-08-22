import { Router } from 'express';
import { ReportController } from '../controllers';
import { authMiddleware, roleMiddleware } from '../middlewares';
import { Role } from '../constants';

export const reportRoute: Router = Router();

reportRoute.get(
  '/revenue',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getRevenue,
);
