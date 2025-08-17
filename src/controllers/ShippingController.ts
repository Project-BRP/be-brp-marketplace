import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  IGetCitiesRequest,
  IGetDistrictsRequest,
  IGetSubDistrictsRequest,
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
}
