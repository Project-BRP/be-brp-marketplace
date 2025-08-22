import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ReportService } from '../services';
import { successResponse } from '../utils';

export class ReportController {
  static async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ReportService.getRevenue();
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
}
