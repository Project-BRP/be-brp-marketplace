import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ICreateCompanyInfoRequest, IUpdateCompanyInfoRequest } from '../dtos';
import { CompanyInfoService } from '../services';
import { successResponse } from '../utils';

export class CompanyInfoController {
  static async createCompanyInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as ICreateCompanyInfoRequest;
      const response = await CompanyInfoService.createCompanyInfo(request);
      return successResponse(
        res,
        StatusCodes.CREATED,
        'Informasi perusahaan berhasil dibuat',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateCompanyInfo(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as IUpdateCompanyInfoRequest;
      const response = await CompanyInfoService.updateCompanyInfo(request);
      return successResponse(
        res,
        StatusCodes.OK,
        'Informasi perusahaan berhasil diperbarui',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CompanyInfoService.getCompanyInfo();
      return successResponse(
        res,
        StatusCodes.OK,
        'Informasi perusahaan berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
