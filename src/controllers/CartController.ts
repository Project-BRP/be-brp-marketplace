import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IAuthDTO, IClearCartRequest, IGetCartRequest } from '../dtos';
import { CartService } from '../services';
import { successResponse } from '../utils';

export class CartController {
  static async getCart(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetCartRequest = {
        userId: req.user.userId,
      };
      const response = await CartService.getCart(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Keranjang berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IClearCartRequest = {
        userId: req.user.userId,
      };
      await CartService.clearCart(request);
      successResponse(res, StatusCodes.OK, 'Keranjang berhasil dikosongkan');
    } catch (error) {
      next(error);
    }
  }
}
