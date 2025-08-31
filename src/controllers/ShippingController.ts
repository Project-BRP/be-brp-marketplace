import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  IGetCitiesRequest,
  IGetDistrictsRequest,
  IGetSubDistrictsRequest,
  ICheckCostRequest,
  IAuthDTO,
  ITrackShippingRequest,
} from '../dtos';
import { ShippingService } from '../services';
import { successResponse } from '../utils';

export class ShippingController {
  static async getProvinces(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await ShippingService.getProvinces();
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar provinsi berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCities(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        provinceId: Number(req.params.provinceId),
      } as IGetCitiesRequest;

      const response = await ShippingService.getCities(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar kota berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getDistricts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        provinceId: Number(req.params.provinceId),
        cityId: Number(req.params.cityId),
      } as IGetDistrictsRequest;

      const response = await ShippingService.getDistricts(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar kecamatan berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getSubDistricts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        provinceId: Number(req.params.provinceId),
        cityId: Number(req.params.cityId),
        districtId: Number(req.params.districtId),
      } as IGetSubDistrictsRequest;

      const response = await ShippingService.getSubDistricts(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar kelurahan berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async checkCost(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ICheckCostRequest;
      const response = await ShippingService.checkCost(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Estimasi biaya pengiriman berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async track(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: ITrackShippingRequest = {
        transactionId: req.params.transactionId,
        userId: req.user.userId,
        userRole: req.user.role,
      };
      const response = await ShippingService.trackTransaction(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Status pengiriman berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async trackMock(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: ITrackShippingRequest = {
        transactionId: req.params.transactionId,
        userId: req.user.userId,
        userRole: req.user.role,
      };
      const response = await ShippingService.trackTransaction(request, {
        mock: true,
      });
      successResponse(
        res,
        StatusCodes.OK,
        'Status pengiriman (mock) berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
