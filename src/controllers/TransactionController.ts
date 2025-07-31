import type { Request, Response, NextFunction } from 'express';
import { IAuthDTO, ICreateTransactionRequest } from '../dtos';
import { TransactionService } from '../services';
import { successResponse } from '../utils/api-response';

export class TransactionController {
  static async createTransaction(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: ICreateTransactionRequest = {
        userId: req.user.userId,
      };
      const response = await TransactionService.createTransaction(request);

      successResponse(res, 201, 'Transaksi berhasil dibuat', response);
    } catch (error) {
      next(error);
    }
  }
}
