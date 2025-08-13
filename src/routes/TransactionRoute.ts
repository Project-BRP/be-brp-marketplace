import { Router } from 'express';
import { TransactionController } from '../controllers';
import { authMiddleware, roleMiddleware } from '../middlewares';
import { Role } from '@prisma/client';

export const transactionRoute: Router = Router();

transactionRoute.post(
  '/',
  authMiddleware,
  TransactionController.createTransaction,
);
transactionRoute.get(
  '/user/:userId',
  authMiddleware,
  TransactionController.getByUserId,
);
transactionRoute.get(
  '/status-list',
  authMiddleware,
  TransactionController.getTxStatusList,
);
transactionRoute.get(
  '/method-list',
  authMiddleware,
  TransactionController.getTxMethodList,
);
transactionRoute.get(
  '/',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  TransactionController.getAll,
);
transactionRoute.post('/notification', TransactionController.transactionNotif);
transactionRoute.get(
  '/:id',
  authMiddleware,
  TransactionController.getById,
);
transactionRoute.patch(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  TransactionController.updateTransactionStatus,
);
transactionRoute.post(
  '/:id/cancel',
  authMiddleware,
  TransactionController.cancelTransaction,
);
