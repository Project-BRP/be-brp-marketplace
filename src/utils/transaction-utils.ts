import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

import { db } from '../configs/database';
import { appLogger } from '../configs/logger';
import { MIDTRANS_SECRET } from '../constants';
import { ResponseError } from '../error/ResponseError';
import {
  TransactionRepository,
  ProductVariantRepository,
  TransactionItemRepository,
} from '../repositories';
import { TxStatus } from '@prisma/client';
import { IGetTransactionResponse } from '../dtos';
import { IoService } from '../services';

export class TransactionUtils {
  static async updateTransactionStatus(
    transaction: IGetTransactionResponse,
    data: any,
    tx: any,
  ): Promise<void> {
    const hash = crypto
      .createHash('sha512')
      .update(
        `${transaction.id}${data.statusCode}${data.grossAmount}${MIDTRANS_SECRET.MIDTRANS_SERVER_KEY}`,
      )
      .digest('hex');

    if (data.signatureKey !== hash) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Invalid Signature Key');
    }

    let responseData = null;
    let transactionStatus = data.transactionStatus;
    let fraudStatus = data.fraudStatus;

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'accept') {
        const updatedTransaction = await TransactionRepository.update(
          transaction.id,
          {
            status: TxStatus.PAID,
            paymentMethod: data.paymentType,
          },
          tx,
        );

        for (const item of transaction.transactionItems) {
          if (item.variant.stock >= item.quantity) {
            await ProductVariantRepository.update(
              item.variant.id,
              {
                stock: {
                  decrement: item.quantity,
                },
              },
              tx,
            );
            continue;
          }
          await TransactionItemRepository.updateById(item.id, {
            isStockIssue: true,
          });
        }

        IoService.emitNewTransaction();

        responseData = updatedTransaction;
      }
    } else if (transactionStatus == 'settlement') {
      const updatedTransaction = await TransactionRepository.update(
        transaction.id,
        {
          status: TxStatus.PAID,
          paymentMethod: data.paymentType,
        },
        tx,
      );

      for (const item of transaction.transactionItems) {
        if (item.variant.stock >= item.quantity) {
          await ProductVariantRepository.update(
            item.variant.id,
            {
              stock: {
                decrement: item.quantity,
              },
            },
            tx,
          );
          continue;
        }
        await TransactionItemRepository.updateById(item.id, {
          isStockIssue: true,
        });
      }

      IoService.emitNewTransaction();

      responseData = updatedTransaction;
    } else if (
      transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'
    ) {
      const updatedTransaction = await TransactionRepository.update(
        transaction.id,
        {
          status: TxStatus.CANCELLED,
        },
        tx,
      );
      responseData = updatedTransaction;
    } else if (transactionStatus == 'pending') {
      const updatedTransaction = await TransactionRepository.update(
        transaction.id,
        {
          status: TxStatus.UNPAID,
        },
        tx,
      );
      responseData = updatedTransaction;
    }

    appLogger.debug('Transaction Status Updated', responseData);
  }

  static async actionAfterTransaction(
    transaction: any,
    data: any,
  ): Promise<void> {
    try {
      await db.$transaction(async (tx: any) => {
        await TransactionUtils.updateTransactionStatus(transaction, data, tx);
      });
    } catch (error) {
      throw error;
    }
  }
}
