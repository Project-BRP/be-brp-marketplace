import type { Request, Response, NextFunction } from 'express';
import {
  ICreateProductTypeRequest,
  IUpdateProductTypeRequest,
  IGetProductTypeRequest,
  IGetAllProductTypesRequest,
  IDeleteProductTypeRequest,
} from '../dtos';
import { ProductTypeService } from '../services';
import { successResponse } from '../utils/api-response';

export class ProductTypeController {
  static async createProductType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ICreateProductTypeRequest;
      const response = await ProductTypeService.create(request);
      successResponse(res, 201, 'Tipe produk berhasil ditambahkan', response);
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
      successResponse(res, 200, 'Tipe produk berhasil diperbarui', response);
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
      successResponse(res, 200, 'Tipe produk berhasil ditemukan', response);
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
        200,
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
      successResponse(res, 200, 'Tipe produk berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
