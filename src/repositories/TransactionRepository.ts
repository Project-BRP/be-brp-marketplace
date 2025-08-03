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

  static async findAll(tx: Prisma.TransactionClient = db) {
    return tx.transaction.findMany({
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

  static async findAllWithPagination(
    skip: number,
    take: number,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transaction.findMany({
      skip: skip,
      take: take,
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

  static async count(tx: Prisma.TransactionClient = db) {
    return tx.transaction.count();
  }

  static async findByUserId(userId: string, tx: Prisma.TransactionClient = db) {
    return tx.transaction.findMany({
      where: { userId },
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

  static async findByUserIdWithPagination(
    userId: string,
    skip: number,
    take: number,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transaction.findMany({
      where: { userId },
      skip: skip,
      take: take,
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

  static async countByUserId(
    userId: string,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.transaction.count({
      where: { userId },
    });
  }
}
