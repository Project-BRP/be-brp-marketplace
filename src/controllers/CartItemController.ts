import type { Request, Response, NextFunction } from 'express';
import {
  IAuthDTO,
  IAddToCartRequest,
  IUpdateCartItemRequest,
  IRemoveCartItemRequest,
} from '../dtos';
import { CartItemService } from '../services';
import { successResponse } from '../utils/api-response';

export class CartItemController {
  static async addToCart(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IAddToCartRequest = {
        userId: req.user.userId,
        variantId: req.body.variantId,
        quantity: req.body.quantity,
      };
      const response = await CartItemService.addToCart(request);
      successResponse(res, 201, 'Item berhasil ditambahkan ke keranjang', response);
    } catch (error) {
      next(error);
    }
  }

  static async updateCartItem(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IUpdateCartItemRequest = {
        userId: req.user.userId,
        cartItemId: req.params.cartItemId,
        quantity: req.body.quantity,
      };
      const response = await CartItemService.updateCartItem(request);
      successResponse(res, 200, 'Item keranjang berhasil diperbarui', response);
    } catch (error) {
      next(error);
    }
  }

  static async removeCartItem(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IRemoveCartItemRequest = {
        userId: req.user.userId,
        cartItemId: req.params.cartItemId,
      };
      await CartItemService.removeCartItem(request);
      successResponse(res, 200, 'Item keranjang berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}