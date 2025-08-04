import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  IAuthDTO,
  ICreateTransactionRequest,
  ITransactionNotifRequest,
  IGetTransactionRequest,
  IGetAllTransactionsRequest,
  IGetTransactionByUserRequest,
  IUpdateTransactionRequest,
  ICancelTransactionRequest,
} from '../dtos';
import { TransactionService } from '../services';
import { successResponse } from '../utils/api-response';
import { TxStatus } from '@prisma/client';

export class TransactionController {
  static async createTransaction(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: ICreateTransactionRequest = {
        userId: req.user.userId,
        city: req.body.city,
        province: req.body.province,
        postalCode: req.body.postalCode,
        shippingAddress: req.body.shippingAddress,
      };
      const response = await TransactionService.createTransaction(request);

      successResponse(
        res,
        StatusCodes.CREATED,
        'Transaksi berhasil dibuat',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async transactionNotif(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        transactionId: req.body.order_id,
        transactionStatus: req.body.transaction_status,
        fraudStatus: req.body.fraud_status,
        statusCode: req.body.status_code,
        grossAmount: req.body.gross_amount,
        paymentType: req.body.payment_type,
        signatureKey: req.body.signature_key,
      } as ITransactionNotifRequest;

      await TransactionService.transactionNotif(request);

      successResponse(
        res,
        StatusCodes.OK,
        'Transaction notification received successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetTransactionRequest = {
        id: req.params.id,
        userId: req.user.userId,
        userRole: req.user.role,
      };

      const response = await TransactionService.getById(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Detail transaksi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetAllTransactionsRequest = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const response = await TransactionService.getAll(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar transaksi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getByUserId(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetTransactionByUserRequest = {
        userId: req.params.userId,
        currentUserId: req.user.userId,
        currentUserRole: req.user.role,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const response = await TransactionService.getAllByUserId(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar transaksi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateTransactionStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
        status: req.body.status as TxStatus,
      } as IUpdateTransactionRequest;

      const response = await TransactionService.updateTransaction(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Status transaksi berhasil diperbarui',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
  static async cancelTransaction(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: ICancelTransactionRequest = {
        id: req.params.id,
        userId: req.user.userId,
        cancelReason: req.body.cancelReason,
        userRole: req.user.role,
      };

      const response = await TransactionService.cancelTransaction(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Transaksi berhasil dibatalkan',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTxStatusList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await TransactionService.getTxStatusList();
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar status transaksi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
