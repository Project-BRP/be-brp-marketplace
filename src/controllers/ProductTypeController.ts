import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  ICreateProductTypeRequest,
  IUpdateProductTypeRequest,
  IGetProductTypeRequest,
  IGetAllProductTypesRequest,
  IDeleteProductTypeRequest,
} from '../dtos';
import { ProductTypeService } from '../services';
import { successResponse } from '../utils';

export class ProductTypeController {
  static async createProductType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ICreateProductTypeRequest;
      const response = await ProductTypeService.create(request);
      successResponse(
        res,
        StatusCodes.CREATED,
        'Tipe produk berhasil ditambahkan',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateProductType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
        ...req.body,
      } as IUpdateProductTypeRequest;
      const response = await ProductTypeService.update(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Tipe produk berhasil diperbarui',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductTypeById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
      } as IGetProductTypeRequest;
      const response = await ProductTypeService.getById(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Tipe produk berhasil ditemukan',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllProductTypes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        search: req.query.search ? (req.query.search as string) : null,
        page: req.query.page ? parseInt(req.query.page as string, 10) : null,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : null,
      } as IGetAllProductTypesRequest;
      const response = await ProductTypeService.getAll(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar tipe produk berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
      } as IDeleteProductTypeRequest;
      await ProductTypeService.delete(request);
      successResponse(res, StatusCodes.OK, 'Tipe produk berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
