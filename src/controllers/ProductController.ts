import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { SharpUtils } from '../utils';
import { StatusCodes } from 'http-status-codes';

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
    let resizedImagePath: string | undefined;

    try {
      if (req.file) {
        resizedImagePath = await SharpUtils.saveProductImage(req.file.path);
      }

      const request: ICreateProductRequest = {
        ...req.body,
        imageUrl: resizedImagePath,
      };

      const response = await ProductService.create(request);
      successResponse(
        res,
        StatusCodes.CREATED,
        'Produk berhasil ditambahkan',
        response,
      );
    } catch (error) {
      if (resizedImagePath && fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }
      next(error);
    }
  }

  static async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let resizedImagePath: string | undefined;

    try {
      if (req.file) {
        resizedImagePath = await SharpUtils.saveProductImage(req.file.path);
      }

      const request: IUpdateProductRequest = {
        id: req.params.id,
        ...req.body,
        imageUrl: resizedImagePath,
      };

      const response = await ProductService.update(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Produk berhasil diperbarui',
        response,
      );
    } catch (error) {
      if (resizedImagePath && fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }
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
      successResponse(
        res,
        StatusCodes.OK,
        'Produk berhasil ditemukan',
        response,
      );
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
      successResponse(
        res,
        StatusCodes.OK,
        'Daftar produk berhasil diambil',
        response,
      );
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
      successResponse(res, StatusCodes.OK, 'Produk berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
