import type { Request, Response, NextFunction } from 'express';
import { IAuthDTO } from '../dtos';
import { CartService } from '../services';
import { successResponse } from '../utils/api-response';

export class CartController {
  static async getCart(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        userId: req.user.userId,
      };
      const response = await CartService.getCart(request);
      successResponse(res, 200, 'Keranjang berhasil diambil', response);
    } catch (error) {
      next(error);
    }
  }
}
