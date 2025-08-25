import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ReportService } from '../services';
import { successResponse } from '../utils';
import {
  IGetRevenueRequest,
  IGetTotalTransactionsRequest,
  IGetTotalProductsSoldRequest,
  IGetTotalActiveUsersRequest,
  IGetMonthlyRevenueRequest,
  IGetMostSoldProductsDistributionRequest,
} from '../dtos';

export class ReportController {
  static async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.query as IGetRevenueRequest;
      const response = await ReportService.getRevenue(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Revenue berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTotalTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.query as IGetTotalTransactionsRequest;
      const response = await ReportService.getTotalTransactions(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Total transaksi berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTotalProductsSold(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.query as IGetTotalProductsSoldRequest;
      const response = await ReportService.getTotalProductsSold(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Total produk terjual berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTotalActiveUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.query as IGetTotalActiveUsersRequest;
      const response = await ReportService.getTotalActiveUsers(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Total pengguna aktif berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlyRevenue(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.query as IGetMonthlyRevenueRequest;
      const response = await ReportService.getMonthlyRevenue(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Data pendapatan bulanan berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMostSoldProductsDistribution(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.query as IGetMostSoldProductsDistributionRequest;
      const response =
        await ReportService.getMostSoldProductsDistribution(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Data distribusi produk terlaris berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
