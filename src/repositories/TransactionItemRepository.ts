import type { Prisma } from '@prisma/client';
import { db } from '../configs/database';

export class TransactionItemRepository {
  static async create(
    data: Prisma.TransactionItemCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transactionItem.create({
      data: data,
      include: {
        variant: {
          include: {
            product: true,
            packaging: true,
          },
        },
      },
    });
  }

  static async createMany(
    data: Prisma.TransactionItemCreateManyInput[],
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transactionItem.createMany({
      data: data,
    });
  }
}
