import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ReportService } from '../services';
import { successResponse, ZipUtils } from '../utils';
import {
  IGetRevenueRequest,
  IGetTotalTransactionsRequest,
  IGetTotalProductsSoldRequest,
  IGetTotalActiveUsersRequest,
  IGetMonthlyRevenueRequest,
  IGetMostSoldProductsDistributionRequest,
  IExportDataRequest
} from '../dtos';

export class ReportController {
  static async exportData(req: Request, res: Response, next: NextFunction) {
    try {
      const request: IExportDataRequest = {
        tables: Object.keys(req.query),
        startYear: req.query.startYear ? Number(req.query.startYear) : undefined,
        startMonth: req.query.startMonth ? Number(req.query.startMonth) : undefined,
        startDay: req.query.startDay ? Number(req.query.startDay) : undefined,
        endYear: req.query.endYear ? Number(req.query.endYear) : undefined,
        endMonth: req.query.endMonth ? Number(req.query.endMonth) : undefined,
        endDay: req.query.endDay ? Number(req.query.endDay) : undefined,
      };

      const files = await ReportService.exportData(request);
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14);
      await ZipUtils.pipeZipToResponse(
        res,
        files,
        `reports_export_${timestamp}.zip`,
      );
    } catch (error) {
      next(error);
    }
  }
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

  static async getTodayTotalTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ReportService.getTodayTotalTransactions();
      return successResponse(
        res,
        StatusCodes.OK,
        'Data total transaksi hari ini berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentMonthRevenue(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ReportService.getCurrentMonthRevenue();
      return successResponse(
        res,
        StatusCodes.OK,
        'Data pendapatan bulan ini berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTotalProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ReportService.getTotalProducts();
      return successResponse(
        res,
        StatusCodes.OK,
        'Total produk berhasil diperoleh',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
