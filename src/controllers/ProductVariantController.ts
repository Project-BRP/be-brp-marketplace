import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { SharpUtils } from '../utils';
import {
  ICreateProductVariantRequest,
  IUpdateProductVariantRequest,
  IGetProductVariantRequest,
  IGetAllProductVariantsRequest,
  IEditStockRequest,
  IDeleteProductVariantRequest,
} from '../dtos';
import { ProductVariantService } from '../services';
import { successResponse } from '../utils/api-response';

export class ProductVariantController {
  static async createProductVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let resizedImagePath: string | undefined;

    try {
      if (req.file) {
        resizedImagePath = await SharpUtils.saveProductVariantImage(
          req.file.path,
        );
      }

      const request: ICreateProductVariantRequest = {
        ...req.body,
        productId: req.params.productId,
        imageUrl: resizedImagePath,
      };

      const response = await ProductVariantService.create(request);
      successResponse(res, 201, 'Varian produk berhasil ditambahkan', response);
    } catch (error) {
      if (resizedImagePath && fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }
      next(error);
    }
  }

  static async updateProductVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let resizedImagePath: string;

    try {
      if (req.file) {
        resizedImagePath = await SharpUtils.saveProductVariantImage(
          req.file.path,
        );
      }

      const request: IUpdateProductVariantRequest = {
        id: req.params.id,
        ...req.body,
        imageUrl: resizedImagePath,
      };

      const response = await ProductVariantService.update(request);
      successResponse(res, 200, 'Varian produk berhasil diperbarui', response);
    } catch (error) {
      if (resizedImagePath && fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }
      next(error);
    }
  }

  static async editStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IEditStockRequest = {
        id: req.params.id,
        stock: req.body.stock,
      };

      const response = await ProductVariantService.editStock(request);
      successResponse(
        res,
        200,
        'Stok varian produk berhasil diperbarui',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductVariantById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetProductVariantRequest = {
        id: req.params.id,
      };
      const response = await ProductVariantService.getById(request);
      successResponse(res, 200, 'Varian produk berhasil ditemukan', response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProductVariants(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetAllProductVariantsRequest = {
        productId: req.params.productId || (req.query.productId as string),
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const response = await ProductVariantService.getAll(request);
      successResponse(
        res,
        200,
        'Daftar varian produk berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IDeleteProductVariantRequest = {
        id: req.params.id,
      };
      await ProductVariantService.delete(request);
      successResponse(res, 200, 'Varian produk berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
