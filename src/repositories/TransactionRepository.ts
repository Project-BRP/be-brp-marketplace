import { Prisma } from '@prisma/client';
import { db } from '../configs/database';

export class TransactionRepository {
  static async create(
    data: Prisma.TransactionCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transaction.create({
      data: data,
    });
  }

  static async update(
    id: string,
    data: Prisma.TransactionUpdateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transaction.update({
      where: { id },
      data: data,
    });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.transaction.findUnique({
      where: { id },
      include: {
        transactionItems: {
          include: {
            variant: {
              include: {
                product: true,
                packaging: true,
              },
            },
          },
        },
      },
    });
  }
}
