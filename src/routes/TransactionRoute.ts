import { Router } from 'express';
import { TransactionController } from '../controllers';
import { authMiddleware } from '../middlewares';

export const transactionRoute: Router = Router();

transactionRoute.post(
  '/',
  authMiddleware,
  TransactionController.createTransaction,
);
