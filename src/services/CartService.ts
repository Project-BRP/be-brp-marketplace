import { StatusCodes } from 'http-status-codes';

import type { IGetCartRequest, IGetCartResponse, ICartItem } from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { CartRepository } from '../repositories';
import { Validator } from '../utils';
import { CartValidation } from '../validations';

export class CartService {
  static async getCart(request: IGetCartRequest): Promise<IGetCartResponse> {
    const validData = Validator.validate(CartValidation.GET_CART, request);

    const cart = await CartRepository.findByUserId(validData.userId);
    if (!cart) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Keranjang tidak ditemukan',
      );
    }

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map(item => ({
        id: item.id,
        variantId: item.variantId!,
        quantity: item.quantity,
        productVariant: {
          id: item.variant!.id,
          productId: item.variant!.productId,
          weight_in_kg: item.variant!.weight_in_kg,
          packaging: item.variant!.packaging
            ? {
                id: item.variant!.packaging.id,
                name: item.variant!.packaging.name,
              }
            : undefined,
          imageUrl: item.variant!.imageUrl,
          priceRupiah: item.variant!.priceRupiah,
          stock: item.variant!.stock,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) as ICartItem[],
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}
