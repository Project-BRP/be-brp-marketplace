import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';

import { db as database } from '../configs/database';
import type {
  ICreateTransactionRequest,
  ICreateTransactionResponse,
  ITransactionItem,
  ITransactionNotifRequest,
} from '../dtos';
import { ResponseError } from '../error/ResponseError';
import {
  UserRepository,
  TransactionItemRepository,
  TransactionRepository,
  CartRepository,
} from '../repositories';
import { PaymentUtils } from '../utils/payment-utils';
import { TransactionUtils } from '../utils/transaction-utils';
import { Validator } from '../utils/validator';
import { TransactionValidation } from '../validations';
import { CartService } from './CartService';
import { IoService } from './IoService';

export class TransactionService {
  static async createTransaction(
    request: ICreateTransactionRequest,
  ): Promise<ICreateTransactionResponse> {
    const validData = Validator.validate(TransactionValidation.CREATE, request);
    const cart = await CartRepository.findByUserId(validData.userId);

    if (!cart?.items.length) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Keranjang tidak boleh kosong',
      );
    }

    const transactionItems: ITransactionItem[] = cart.items.map(item => ({
      variantId: item.variantId!,
      weight_in_kg: item.variant.weight_in_kg,
      packaging: item.variant.packaging?.name,
      productId: item.variant.product.id,
      quantity: item.quantity,
      priceRupiah: item.variant.priceRupiah * item.quantity,
      productName: item.variant.product.name,
    }));

    const totalAmount = transactionItems.reduce(
      (sum, item) => sum + item.priceRupiah,
      0,
    );

    const shippingCost = 20000;
    const shippingAddress = 'Jalan Example No. 123, Jakarta';
    const transactionId = `TX-${uuid()}`;
    const grossAmount = totalAmount + shippingCost;

    const user = await UserRepository.findById(validData.userId);

    if (!user) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Pengguna tidak ditemukan',
      );
    }

    const customerDetails = {
      name: user.name,
      email: user.email,
      shippingAddress,
    };

    const payment = await PaymentUtils.sendToPaymentGateway(
      transactionId,
      grossAmount,
      transactionItems,
      customerDetails,
      shippingCost,
    );

    const db = database;

    try {
      const newTransaction = await db.$transaction(async tx => {
        const createdTransaction = await TransactionRepository.create(
          {
            id: transactionId,
            user: { connect: { id: user.id } },
            userName: user.name,
            userEmail: user.email,
            totalPrice: grossAmount,
            shippingCost,
            shippingAddress,
            snapUrl: payment.redirect_url,
            snapToken: payment.token,
          },
          tx,
        );

        const transactionItemData = transactionItems.map(item => ({
          id: `TI-${uuid()}`,
          transactionId: createdTransaction.id,
          variantId: item.variantId,
          quantity: item.quantity,
          priceRupiah: item.priceRupiah,
        }));

        await TransactionItemRepository.createMany(transactionItemData, tx);
        await CartService.clearCart({ userId: validData.userId });

        IoService.emitTransaction();

        return createdTransaction;
      });

      return newTransaction;
    } catch (error) {
      throw error;
    }
  }

  static async transactionNotif(
    request: ITransactionNotifRequest,
  ): Promise<void> {
    const validData = Validator.validate(TransactionValidation.NOTIF, request);

    const transaction = await TransactionRepository.findById(
      validData.transactionId,
    );
    if (transaction) {
      TransactionUtils.actionAfterTransaction(transaction, validData);
    }
  }
}
