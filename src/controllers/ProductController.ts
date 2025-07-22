import type { Request, Response, NextFunction } from 'express';
import {
  ICreateProductRequest,
  IUpdateProductRequest,
  IGetProductRequest,
  IGetAllProductsRequest,
  IDeleteProductRequest,
} from '../dtos';
import { ProductService } from '../services';
import { successResponse } from '../utils/api-response';

export class ProductController {
  static async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ICreateProductRequest;
      const response = await ProductService.create(request);
      successResponse(res, 201, 'Produk berhasil ditambahkan', response);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
        ...req.body,
      } as IUpdateProductRequest;
      const response = await ProductService.update(request);
      successResponse(res, 200, 'Produk berhasil diperbarui', response);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
      } as IGetProductRequest;
      const response = await ProductService.getById(request);
      successResponse(res, 200, 'Produk berhasil ditemukan', response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        search: req.query.search ? (req.query.search as string) : undefined,
        page: req.query.page
          ? parseInt(req.query.page as string, 10)
          : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : undefined,
        productTypeId: req.query.productTypeId
          ? (req.query.productTypeId as string)
          : undefined,
      } as IGetAllProductsRequest;
      const response = await ProductService.getAll(request);
      successResponse(res, 200, 'Daftar produk berhasil diambil', response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        id: req.params.id,
      } as IDeleteProductRequest;
      await ProductService.delete(request);
      successResponse(res, 200, 'Produk berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
