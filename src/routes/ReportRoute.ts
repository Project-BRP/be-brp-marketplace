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

reportRoute.get(
  '/total-transactions',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getTotalTransactions,
);

reportRoute.get(
  '/total-products-sold',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getTotalProductsSold,
);

reportRoute.get(
  '/total-active-users',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getTotalActiveUsers,
);

reportRoute.get(
  '/monthly-revenue',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getMonthlyRevenue,
);

reportRoute.get(
  '/most-sold-products-distribution',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getMostSoldProductsDistribution,
);

reportRoute.get(
  '/current-month-revenue',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getCurrentMonthRevenue,
);

reportRoute.get(
  '/today-total-transactions',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getTodayTotalTransactions,
);

reportRoute.get(
  '/total-products',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ReportController.getTotalProducts,
);
