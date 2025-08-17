import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  ICreatePackagingRequest,
  IUpdatePackagingRequest,
  IGetPackagingRequest,
  IGetAllPackagingsRequest,
  IDeletePackagingRequest,
} from '../dtos';
import { PackagingService } from '../services';
import { successResponse } from '../utils';

export class PackagingController {
  static async createPackaging(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ICreatePackagingRequest;
      const response = await PackagingService.create(request);
      successResponse(
        res,
        StatusCodes.CREATED,
        'Kemasan berhasil ditambahkan',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async updatePackaging(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
        ...req.body,
      } as IUpdatePackagingRequest;
      const response = await PackagingService.update(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Kemasan berhasil diperbarui',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPackagingById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
      } as IGetPackagingRequest;
      const response = await PackagingService.getById(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Kemasan berhasil ditemukan',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllPackagings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        search: req.query.search ? (req.query.search as string) : null,
        page: req.query.page ? parseInt(req.query.page as string, 10) : null,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : null,
      } as IGetAllPackagingsRequest;
      const response = await PackagingService.getAll(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar kemasan berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async deletePackaging(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
      } as IDeletePackagingRequest;
      await PackagingService.delete(request);
      successResponse(res, StatusCodes.OK, 'Kemasan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
