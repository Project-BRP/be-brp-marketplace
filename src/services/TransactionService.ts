import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { TxDeliveryStatus, TxManualStatus, TxMethod } from '@prisma/client';

import { db as database } from '../configs/database';
import type {
  ICreateTransactionRequest,
  ICreateTransactionResponse,
  IGetTransactionRequest,
  IGetTransactionResponse,
  ITransactionItem,
  ITransactionNotifRequest,
  IGetAllTransactionsRequest,
  IGetAllTransactionsResponse,
  IGetTransactionByUserRequest,
  IGetTransactionByUserResponse,
  IUpdateTransactionRequest,
  IUpdateTransactionResponse,
  ICancelTransactionRequest,
  ICancelTransactionResponse,
  IGetTxStatusListResponse,
  IGetTxMethodListResponse,
} from '../dtos';
import { ResponseError } from '../error/ResponseError';
import {
  UserRepository,
  TransactionItemRepository,
  TransactionRepository,
  CartRepository,
  PPNRepository,
  ProductVariantRepository,
} from '../repositories';
import { PaymentUtils } from '../utils/payment-utils';
import { TransactionUtils } from '../utils/transaction-utils';
import { Validator } from '../utils/validator';
import { TransactionValidation } from '../validations';
import { CartService } from './CartService';
import { IoService } from './IoService';
import { Role } from '@prisma/client';

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

    const PPNPercentage = await PPNRepository.findCurrentPPN();

    if (!PPNPercentage) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Terjadi Kesalahan',
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

    let shippingCost = 0;

    if (validData.method === TxMethod.DELIVERY) {
      if (!validData.shippingAddress) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Alamat pengiriman tidak boleh kosong',
        );
      }
      shippingCost = 20000;
    }

    const transactionId = `TX-${uuid()}`;
    const PPN = (PPNPercentage.percentage / 100) * totalAmount;
    const grossAmount = totalAmount + PPN + shippingCost;

    const user = await UserRepository.findById(validData.userId);

    if (!user) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Pengguna tidak ditemukan',
      );
    }

    const userFirstName = user.name.split(' ')[0];
    const userLastName = user.name.split(' ').slice(1).join(' ') || undefined;
    const customerDetails = {
      first_name: userFirstName,
      last_name: userLastName,
      email: user.email,
      phone: user.phoneNumber,
      address: validData.shippingAddress,
      shipping_address: {
        first_name: userFirstName,
        last_name: userLastName,
        address: validData.shippingAddress,
        city: validData.city,
        phone: user.phoneNumber,
        postal_code: validData.postalCode,
      },
    };

    const payment = await PaymentUtils.sendToPaymentGateway(
      transactionId,
      PPN,
      grossAmount,
      transactionItems,
      customerDetails,
      shippingCost,
    );

    const isDelivery = validData.method === TxMethod.DELIVERY;

    const db = database;

    try {
      const newTransaction = await db.$transaction(async tx => {
        const createdTransaction = await TransactionRepository.create(
          {
            id: transactionId,
            user: { connect: { id: user.id } },
            userName: user.name,
            userEmail: user.email,
            userPhoneNumber: user.phoneNumber,
            cleanPrice: totalAmount,
            priceWithPPN: PPN + totalAmount,
            totalPrice: grossAmount,
            PPNPercentage: PPNPercentage.percentage,
            city: validData.city,
            province: validData.province,
            postalCode: validData.postalCode,
            method: validData.method,
            deliveryStatus: isDelivery ? TxDeliveryStatus.UNPAID : null,
            manualStatus: isDelivery ? null : TxManualStatus.UNPAID,
            shippingCost: isDelivery ? shippingCost : null,
            shippingAddress: validData.shippingAddress,
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
      const transactionClearedData: IGetTransactionResponse = {
        id: transaction.id,
        userId: transaction.userId,
        userName: transaction.userName,
        userEmail: transaction.userEmail,
        userPhoneNumber: transaction.userPhoneNumber,
        method: transaction.method,
        deliveryStatus: transaction.deliveryStatus,
        manualStatus: transaction.manualStatus,
        cleanPrice: transaction.cleanPrice,
        priceWithPPN: transaction.priceWithPPN,
        totalPrice: transaction.totalPrice,
        PPNPercentage: transaction.PPNPercentage,
        snapToken: transaction.snapToken,
        snapUrl: transaction.snapUrl,
        shippingAddress: transaction.shippingAddress,
        shippingCost: transaction.shippingCost,
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        transactionItems: transaction.transactionItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          priceRupiah: item.priceRupiah,
          isStockIssue: item.isStockIssue,
          variant: {
            id: item.variant.id,
            weight_in_kg: item.variant.weight_in_kg,
            imageUrl: item.variant.imageUrl || null,
            priceRupiah: item.variant.priceRupiah,
            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              imageUrl: item.variant.product.imageUrl || null,
            },
            packaging: item.variant.packaging && {
              id: item.variant.packaging.id,
              name: item.variant.packaging.name,
            },
            stock: item.variant.stock,
          },
        })),
      };
      TransactionUtils.actionAfterTransaction(
        transactionClearedData,
        validData,
      );
    }
  }

  static async getById(
    request: IGetTransactionRequest,
  ): Promise<IGetTransactionResponse> {
    const validData = Validator.validate(
      TransactionValidation.GET_BY_ID,
      request,
    );
    const transaction = await TransactionRepository.findById(validData.id);

    if (!transaction) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaksi tidak ditemukan',
      );
    }

    if (
      transaction.userId !== validData.userId &&
      validData.userRole !== Role.ADMIN
    ) {
      throw new ResponseError(
        StatusCodes.FORBIDDEN,
        'Anda tidak memiliki akses ke transaksi ini',
      );
    }

    return {
      id: transaction.id,
      userId: transaction.userId,
      userName: transaction.userName,
      userEmail: transaction.userEmail,
      userPhoneNumber: transaction.userPhoneNumber,
      method: transaction.method,
      deliveryStatus: transaction.deliveryStatus,
      manualStatus: transaction.manualStatus,
      cleanPrice: transaction.cleanPrice,
      priceWithPPN: transaction.priceWithPPN,
      totalPrice: transaction.totalPrice,
      PPNPercentage: transaction.PPNPercentage,
      snapToken: transaction.snapToken,
      snapUrl: transaction.snapUrl,
      shippingAddress: transaction.shippingAddress,
      shippingCost: transaction.shippingCost,
      paymentMethod: transaction.paymentMethod,
      isRefundFailed: transaction.isRefundFailed,
      cancelReason: transaction.cancelReason,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      transactionItems: transaction.transactionItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        priceRupiah: item.priceRupiah,
        isStockIssue: item.isStockIssue,
        variant: {
          id: item.variant.id,
          weight_in_kg: item.variant.weight_in_kg,
          imageUrl: item.variant.imageUrl || null,
          priceRupiah: item.variant.priceRupiah,
          product: {
            id: item.variant.product.id,
            name: item.variant.product.name,
            imageUrl: item.variant.product.imageUrl || null,
          },
          packaging: item.variant.packaging && {
            id: item.variant.packaging.id,
            name: item.variant.packaging.name,
          },
          stock: item.variant.stock,
        },
      })),
    };
  }

  static async getAll(
    request: IGetAllTransactionsRequest,
  ): Promise<IGetAllTransactionsResponse> {
    const validData = Validator.validate(
      TransactionValidation.GET_ALL,
      request,
    );

    const take = validData.limit;
    const skip = (validData.page - 1) * take;

    if (!take || !validData.page) {
      const transactions = await TransactionRepository.findAll();

      return {
        totalPage: 1,
        currentPage: 1,
        transactions: transactions.map(transaction => ({
          id: transaction.id,
          userId: transaction.userId,
          userName: transaction.userName,
          userEmail: transaction.userEmail,
          userPhoneNumber: transaction.userPhoneNumber,
          method: transaction.method,
          deliveryStatus: transaction.deliveryStatus,
          manualStatus: transaction.manualStatus,
          cleanPrice: transaction.cleanPrice,
          priceWithPPN: transaction.priceWithPPN,
          totalPrice: transaction.totalPrice,
          PPNPercentage: transaction.PPNPercentage,
          snapToken: transaction.snapToken,
          snapUrl: transaction.snapUrl,
          shippingAddress: transaction.shippingAddress,
          shippingCost: transaction.shippingCost,
          paymentMethod: transaction.paymentMethod,
          isRefundFailed: transaction.isRefundFailed,
          cancelReason: transaction.cancelReason,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          transactionItems: transaction.transactionItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            priceRupiah: item.priceRupiah,
            isStockIssue: item.isStockIssue,
            variant: {
              id: item.variant.id,
              weight_in_kg: item.variant.weight_in_kg,
              imageUrl: item.variant.imageUrl || null,
              priceRupiah: item.variant.priceRupiah,
              product: {
                id: item.variant.product.id,
                name: item.variant.product.name,
                imageUrl: item.variant.product.imageUrl || null,
              },
              packaging: item.variant.packaging && {
                id: item.variant.packaging.id,
                name: item.variant.packaging.name,
              },
              stock: item.variant.stock,
            },
          })),
        })),
      };
    }

    const totalTransactions = await TransactionRepository.count();

    if (totalTransactions === 0) {
      return {
        totalPage: 1,
        currentPage: 1,
        transactions: [],
      };
    }

    if (skip >= totalTransactions) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Halaman tidak valid');
    }

    const transactions = await TransactionRepository.findAllWithPagination(
      skip,
      take,
    );

    const totalPage = Math.ceil(totalTransactions / take);
    const currentPage = Math.ceil(skip / take) + 1;

    return {
      totalPage,
      currentPage,
      transactions: transactions.map(transaction => ({
        id: transaction.id,
        userId: transaction.userId,
        userName: transaction.userName,
        userEmail: transaction.userEmail,
        userPhoneNumber: transaction.userPhoneNumber,
        method: transaction.method,
        deliveryStatus: transaction.deliveryStatus,
        manualStatus: transaction.manualStatus,
        cleanPrice: transaction.cleanPrice,
        priceWithPPN: transaction.priceWithPPN,
        totalPrice: transaction.totalPrice,
        PPNPercentage: transaction.PPNPercentage,
        snapToken: transaction.snapToken,
        snapUrl: transaction.snapUrl,
        shippingAddress: transaction.shippingAddress,
        shippingCost: transaction.shippingCost,
        paymentMethod: transaction.paymentMethod,
        isRefundFailed: transaction.isRefundFailed,
        cancelReason: transaction.cancelReason,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        transactionItems: transaction.transactionItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          priceRupiah: item.priceRupiah,
          isStockIssue: item.isStockIssue,
          variant: {
            id: item.variant.id,
            weight_in_kg: item.variant.weight_in_kg,
            imageUrl: item.variant.imageUrl || null,
            priceRupiah: item.variant.priceRupiah,
            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              imageUrl: item.variant.product.imageUrl || null,
            },
            packaging: item.variant.packaging && {
              id: item.variant.packaging.id,
              name: item.variant.packaging.name,
            },
            stock: item.variant.stock,
          },
        })),
      })),
    };
  }

  static async getAllByUserId(
    request: IGetTransactionByUserRequest,
  ): Promise<IGetTransactionByUserResponse> {
    const validData = Validator.validate(
      TransactionValidation.GET_ALL_BY_USER,
      request,
    );

    const isSelf = validData.currentUserId === validData.userId;
    const isAdmin = validData.currentUserRole === Role.ADMIN;

    if (!isSelf && !isAdmin) {
      throw new ResponseError(
        StatusCodes.FORBIDDEN,
        'Anda tidak memiliki akses untuk melihat transaksi ini',
      );
    }

    const take = validData.limit;
    const skip = (validData.page - 1) * take;

    if (!take || !validData.page) {
      const transactions = await TransactionRepository.findByUserId(
        validData.userId,
      );

      return {
        totalPage: 1,
        currentPage: 1,
        transactions: transactions.map(transaction => ({
          id: transaction.id,
          userId: transaction.userId,
          userName: transaction.userName,
          userEmail: transaction.userEmail,
          userPhoneNumber: transaction.userPhoneNumber,
          method: transaction.method,
          deliveryStatus: transaction.deliveryStatus,
          manualStatus: transaction.manualStatus,
          cleanPrice: transaction.cleanPrice,
          priceWithPPN: transaction.priceWithPPN,
          totalPrice: transaction.totalPrice,
          PPNPercentage: transaction.PPNPercentage,
          snapToken: transaction.snapToken,
          snapUrl: transaction.snapUrl,
          shippingAddress: transaction.shippingAddress,
          shippingCost: transaction.shippingCost,
          paymentMethod: transaction.paymentMethod,
          isRefundFailed: transaction.isRefundFailed,
          cancelReason: transaction.cancelReason,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          transactionItems: transaction.transactionItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            priceRupiah: item.priceRupiah,
            isStockIssue: item.isStockIssue,
            variant: {
              id: item.variant.id,
              weight_in_kg: item.variant.weight_in_kg,
              imageUrl: item.variant.imageUrl || null,
              priceRupiah: item.variant.priceRupiah,
              product: {
                id: item.variant.product.id,
                name: item.variant.product.name,
                imageUrl: item.variant.product.imageUrl || null,
              },
              packaging: item.variant.packaging && {
                id: item.variant.packaging.id,
                name: item.variant.packaging.name,
              },
              stock: item.variant.stock,
            },
          })),
        })),
      };
    }

    const totalTransactions = await TransactionRepository.countByUserId(
      validData.userId,
    );

    if (totalTransactions === 0) {
      return {
        totalPage: 1,
        currentPage: 1,
        transactions: [],
      };
    }

    if (skip >= totalTransactions) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Halaman tidak valid');
    }

    const transactions = await TransactionRepository.findByUserIdWithPagination(
      validData.userId,
      skip,
      take,
    );

    const totalPage = Math.ceil(totalTransactions / take);
    const currentPage = Math.ceil(skip / take) + 1;

    return {
      totalPage,
      currentPage,
      transactions: transactions.map(transaction => ({
        id: transaction.id,
        userId: transaction.userId,
        userName: transaction.userName,
        userEmail: transaction.userEmail,
        userPhoneNumber: transaction.userPhoneNumber,
        method: transaction.method,
        deliveryStatus: transaction.deliveryStatus,
        manualStatus: transaction.manualStatus,
        cleanPrice: transaction.cleanPrice,
        priceWithPPN: transaction.priceWithPPN,
        totalPrice: transaction.totalPrice,
        PPNPercentage: transaction.PPNPercentage,
        snapToken: transaction.snapToken,
        snapUrl: transaction.snapUrl,
        shippingAddress: transaction.shippingAddress,
        shippingCost: transaction.shippingCost,
        paymentMethod: transaction.paymentMethod,
        isRefundFailed: transaction.isRefundFailed,
        cancelReason: transaction.cancelReason,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        transactionItems: transaction.transactionItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          priceRupiah: item.priceRupiah,
          isStockIssue: item.isStockIssue,
          variant: {
            id: item.variant.id,
            weight_in_kg: item.variant.weight_in_kg,
            imageUrl: item.variant.imageUrl || null,
            priceRupiah: item.variant.priceRupiah,
            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              imageUrl: item.variant.product.imageUrl || null,
            },
            packaging: item.variant.packaging && {
              id: item.variant.packaging.id,
              name: item.variant.packaging.name,
            },
            stock: item.variant.stock,
          },
        })),
      })),
    };
  }

  static async updateTransaction(
    request: IUpdateTransactionRequest,
  ): Promise<IUpdateTransactionResponse> {
    const validData = Validator.validate(TransactionValidation.UPDATE, request);

    const transaction = await TransactionRepository.findById(validData.id);
    if (!transaction) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaksi tidak ditemukan',
      );
    }

    const txMethod = transaction.method;

    if (validData.manualStatus && validData.deliveryStatus) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Hanya satu jenis status yang boleh diubah dalam satu waktu',
      );
    }

    const db = database;

    if (txMethod === TxMethod.DELIVERY) {
      if (!validData.deliveryStatus) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status pengiriman tidak boleh kosong',
        );
      }
      if (validData.manualStatus) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status manual tidak boleh diisi untuk transaksi dengan metode pengiriman',
        );
      }

      const statusOrder = {
        [TxDeliveryStatus.UNPAID]: 0,
        [TxDeliveryStatus.PAID]: 1,
        [TxDeliveryStatus.SHIPPED]: 2,
        [TxDeliveryStatus.DELIVERED]: 3,
        [TxDeliveryStatus.CANCELLED]: 4,
      };

      const current = transaction.deliveryStatus;
      const next = validData.deliveryStatus;

      if (!(next in statusOrder)) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status pengiriman tidak valid',
        );
      }

      if (current === TxDeliveryStatus.CANCELLED) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Transaksi sudah dibatalkan',
        );
      }

      if (statusOrder[next] < statusOrder[current]) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status tidak boleh mundur',
        );
      }

      if (next === current) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status tidak berubah',
        );
      }

      if (
        next !== TxDeliveryStatus.CANCELLED &&
        statusOrder[next] - statusOrder[current] > 1
      ) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status tidak boleh lompat lebih dari satu langkah',
        );
      }

      if (
        current === TxDeliveryStatus.PAID &&
        next !== TxDeliveryStatus.CANCELLED
      ) {
        const hasStockIssue = transaction.transactionItems.some(
          item => item.isStockIssue === true,
        );
        if (hasStockIssue) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Stock issue harus di-resolve terlebih dahulu',
          );
        }
      }

      if (next === TxDeliveryStatus.PAID) {
        const midtransStatus = await PaymentUtils.checkTransactionStatus(
          validData.id,
        );
        if (
          !['settlement', 'capture'].includes(midtransStatus.transaction_status)
        ) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Status pembayaran belum valid',
          );
        }

        try {
          const updated = await db.$transaction(async tx => {
            const updatedTransaction = await TransactionRepository.update(
              validData.id,
              {
                deliveryStatus: next,
              },
              tx,
            );

            for (const item of updatedTransaction.transactionItems) {
              if (item.variant.stock >= item.quantity) {
                await ProductVariantRepository.update(
                  item.variant.id,
                  {
                    stock: { decrement: item.quantity },
                  },
                  tx,
                );
              } else {
                await TransactionItemRepository.updateById(
                  item.id,
                  {
                    isStockIssue: true,
                  },
                  tx,
                );
              }
            }

            return updatedTransaction;
          });

          IoService.emitTransaction();
          return updated;
        } catch (error) {
          throw error;
        }
      }

      const updated = await TransactionRepository.update(validData.id, {
        deliveryStatus: next,
      });

      IoService.emitTransaction();
      return updated;
    } else if (txMethod === TxMethod.MANUAL) {
      if (!validData.manualStatus) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status manual tidak boleh kosong',
        );
      }
      if (validData.deliveryStatus) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status pengiriman tidak boleh diisi untuk transaksi manual',
        );
      }

      const statusOrder = {
        [TxManualStatus.UNPAID]: 0,
        [TxManualStatus.PAID]: 1,
        [TxManualStatus.PROCESSING]: 2,
        [TxManualStatus.COMPLETE]: 3,
        [TxManualStatus.CANCELLED]: 4,
      };

      const current = transaction.manualStatus;
      const next = validData.manualStatus;

      if (!(next in statusOrder)) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status manual tidak valid',
        );
      }

      if (current === TxManualStatus.CANCELLED) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Transaksi sudah dibatalkan',
        );
      }

      if (statusOrder[next] < statusOrder[current]) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status tidak boleh mundur',
        );
      }

      if (next === current) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status tidak berubah',
        );
      }

      if (
        next !== TxManualStatus.CANCELLED &&
        statusOrder[next] - statusOrder[current] > 1
      ) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Status tidak boleh lompat lebih dari satu langkah',
        );
      }

      if (
        current === TxManualStatus.PAID &&
        next !== TxManualStatus.CANCELLED
      ) {
        const hasStockIssue = transaction.transactionItems.some(
          item => item.isStockIssue === true,
        );
        if (hasStockIssue) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Stock issue harus di-resolve terlebih dahulu',
          );
        }
      }

      if (next === TxManualStatus.PAID) {
        const midtransStatus = await PaymentUtils.checkTransactionStatus(
          validData.id,
        );
        if (
          !['settlement', 'capture'].includes(midtransStatus.transaction_status)
        ) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Status pembayaran belum valid',
          );
        }

        try {
          const updated = await db.$transaction(async tx => {
            const updatedTransaction = await TransactionRepository.update(
              validData.id,
              {
                manualStatus: next,
              },
              tx,
            );

            for (const item of updatedTransaction.transactionItems) {
              if (item.variant.stock >= item.quantity) {
                await ProductVariantRepository.update(
                  item.variant.id,
                  {
                    stock: { decrement: item.quantity },
                  },
                  tx,
                );
              } else {
                await TransactionItemRepository.updateById(
                  item.id,
                  {
                    isStockIssue: true,
                  },
                  tx,
                );
              }
            }

            return updatedTransaction;
          });

          IoService.emitTransaction();
          return updated;
        } catch (error) {
          throw error;
        }
      }

      const updated = await TransactionRepository.update(validData.id, {
        manualStatus: next,
      });

      IoService.emitTransaction();
      return updated;
    }

    throw new ResponseError(
      StatusCodes.BAD_REQUEST,
      'Metode transaksi tidak dikenali',
    );
  }

  static async cancelTransaction(
    request: ICancelTransactionRequest,
  ): Promise<ICancelTransactionResponse> {
    const validData = Validator.validate(TransactionValidation.CANCEL, request);

    const transaction = await TransactionRepository.findById(validData.id);
    if (!transaction) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Transaksi tidak ditemukan',
      );
    }

    const txMethod = transaction.method;

    if (
      transaction.userId !== validData.userId &&
      validData.userRole !== Role.ADMIN
    ) {
      throw new ResponseError(
        StatusCodes.FORBIDDEN,
        'Anda tidak memiliki akses untuk membatalkan transaksi ini',
      );
    }

    if (txMethod === TxMethod.DELIVERY) {
      if (
        transaction.deliveryStatus === TxDeliveryStatus.CANCELLED ||
        transaction.deliveryStatus === TxDeliveryStatus.SHIPPED ||
        transaction.deliveryStatus === TxDeliveryStatus.DELIVERED
      ) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Transaksi tidak dapat dibatalkan',
        );
      }
    } else if (txMethod === TxMethod.MANUAL) {
      if (
        transaction.manualStatus === TxManualStatus.PROCESSING ||
        transaction.manualStatus === TxManualStatus.CANCELLED ||
        transaction.manualStatus === TxManualStatus.COMPLETE
      ) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Transaksi tidak dapat dibatalkan',
        );
      }
    } else {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Metode transaksi tidak dikenali',
      );
    }

    const midtransStatus = await PaymentUtils.checkTransactionStatus(
      validData.id,
    );
    const isPaid = ['settlement', 'capture'].includes(
      midtransStatus.transaction_status,
    );

    const db = database;

    try {
      const updatedTransaction = await db.$transaction(async tx => {
        const updatePayload = {
          cancelReason: validData.cancelReason,
          ...(txMethod === TxMethod.DELIVERY
            ? { deliveryStatus: TxDeliveryStatus.CANCELLED }
            : { manualStatus: TxManualStatus.CANCELLED }),
        };

        let cancelledTransaction = await TransactionRepository.update(
          validData.id,
          updatePayload,
          tx,
        );

        for (const item of cancelledTransaction.transactionItems) {
          if (!item.isStockIssue) {
            await ProductVariantRepository.update(
              item.variant.id,
              {
                stock: { increment: item.quantity },
              },
              tx,
            );
          }
        }

        IoService.emitTransaction();

        if (isPaid) {
          const refundResult = await PaymentUtils.refundTransaction(
            validData.id,
            validData.cancelReason,
          );

          if (refundResult.status_code !== '200') {
            cancelledTransaction = await TransactionRepository.update(
              validData.id,
              {
                isRefundFailed: true,
              },
              tx,
            );
          }
        }

        return cancelledTransaction;
      });

      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }

  static async getTxStatusList(): Promise<IGetTxStatusListResponse> {
    const deliveryStatusList = Object.values(TxDeliveryStatus);
    const manualStatusList = Object.values(TxManualStatus);

    return {
      deliveryStatusList,
      manualStatusList,
    };
  }

  static async getTxMethodList(): Promise<IGetTxMethodListResponse> {
    const txMethodList = Object.values(TxMethod);
    return { txMethodList };
  }
}
