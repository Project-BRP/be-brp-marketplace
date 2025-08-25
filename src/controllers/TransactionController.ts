import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  IAuthDTO,
  ICreateTransactionRequest,
  ITransactionNotifRequest,
  IRequestPaymentRequest,
  IGetTransactionRequest,
  IGetAllTransactionsRequest,
  IGetTransactionByUserRequest,
  IUpdateTransactionRequest,
  IAddManualShippingCostRequest,
  ICancelTransactionRequest,
} from '../dtos';
import { TransactionService } from '../services';
import { successResponse } from '../utils';
import { TxMethod, TxDeliveryStatus, TxManualStatus } from '@prisma/client';

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
        district: req.body.district,
        subDistrict: req.body.subDistrict,
        postalCode: req.body.postalCode,
        shippingAddress: req.body.shippingAddress,
        shippingCode: req.body.shippingCode,
        shippingService: req.body.shippingService,
        method: req.body.method as TxMethod,
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

  static async requestPayment(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        transactionId: req.params.id,
        userId: req.user.userId,
      } as IRequestPaymentRequest;

      const response = await TransactionService.requestPayment(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Permintaan pembayaran berhasil',
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
        method: req.query.method as TxMethod,
        search: req.query.search as string,
        status: req.query.status as TxDeliveryStatus | TxManualStatus,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        startYear: req.query.startYear
          ? parseInt(req.query.startYear as string, 10)
          : undefined,
        startMonth: req.query.startMonth
          ? parseInt(req.query.startMonth as string, 10)
          : undefined,
        startDay: req.query.startDay
          ? parseInt(req.query.startDay as string, 10)
          : undefined,
        endYear: req.query.endYear
          ? parseInt(req.query.endYear as string, 10)
          : undefined,
        endMonth: req.query.endMonth
          ? parseInt(req.query.endMonth as string, 10)
          : undefined,
        endDay: req.query.endDay
          ? parseInt(req.query.endDay as string, 10)
          : undefined,
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
        method: req.query.method as TxMethod,
        status: req.query.status as TxDeliveryStatus | TxManualStatus,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        search: req.query.search as string,
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
      const request: IUpdateTransactionRequest = {
        id: req.params.id,
        deliveryStatus:
          req.body.deliveryStatus !== undefined
            ? (req.body.deliveryStatus as TxDeliveryStatus)
            : undefined,
        manualStatus:
          req.body.manualStatus !== undefined
            ? (req.body.manualStatus as TxManualStatus)
            : undefined,
      };

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

  static async addManualShippingCost(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IAddManualShippingCostRequest = {
        transactionId: req.params.id,
        manualShippingCost: req.body.manualShippingCost,
      };

      const response = await TransactionService.addManualShippingCost(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Biaya pengiriman manual berhasil ditambahkan',
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

  static async getTxMethodList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await TransactionService.getTxMethodList();
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar metode transaksi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionDateRanges(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await TransactionService.getTransactionDateRanges();
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar rentang tanggal transaksi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
