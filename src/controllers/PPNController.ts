import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  IUpdatePPNRequest,
  IUpdatePPNResponse,
  IGetPPNResponse,
} from '../dtos';
import { PPNService } from '../services';
import { successResponse } from '../utils';

export class PPNController {
  static async getCurrentPPN(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    ``;
    try {
      const response = await PPNService.getCurrentPPN();
      successResponse(res, StatusCodes.OK, 'PPN berhasil ditemukan', response);
    } catch (error) {
      next(error);
    }
  }

  static async updatePPN(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as IUpdatePPNRequest;
      const response = await PPNService.updatePPN(request);
      successResponse(res, StatusCodes.OK, 'PPN berhasil diperbarui', response);
    } catch (error) {
      next(error);
    }
  }
}
