import { Prisma, TxMethod } from '@prisma/client';
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

  static async findAll(method?: TxMethod, search?: string, tx: Prisma.TransactionClient = db) {
    const whereCondition: Prisma.TransactionWhereInput = {}

    if (method) {
      whereCondition.method = method;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } }
      ];
    }

    return tx.transaction.findMany({
      where: {
        ...whereCondition
      },
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
    method?: TxMethod,
    search?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const whereCondition: Prisma.TransactionWhereInput = {};

    if (method) {
      whereCondition.method = method;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } }
      ];
    }

    return tx.transaction.findMany({
      skip: skip,
      take: take,
      where: {
        ...whereCondition
      },
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

  static async count(method?: TxMethod, search?: string, tx: Prisma.TransactionClient = db) {
    const whereCondition: Prisma.TransactionWhereInput = {};

    if (method) {
      whereCondition.method = method;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } }
      ];
    }

    return tx.transaction.count({
      where: {
        ...whereCondition
      }
    });
  }

  static async findByUserId(userId: string, method?: TxMethod, search?: string, tx: Prisma.TransactionClient = db) {
    const whereCondition: Prisma.TransactionWhereInput = { userId };

    if (method) {
      whereCondition.method = method;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } }
      ];
    }

    return tx.transaction.findMany({
      where: { ...whereCondition },
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
    method?: TxMethod,
    search?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const whereCondition: Prisma.TransactionWhereInput = { userId };

    if (method) {
      whereCondition.method = method;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } }
      ];
    }

    return tx.transaction.findMany({
      where: { ...whereCondition },
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
    method?: TxMethod,
    search?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const whereCondition: Prisma.TransactionWhereInput = { userId };

    if (method) {
      whereCondition.method = method;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { userName: { contains: search, mode: 'insensitive' } }
      ];
    }

    return tx.transaction.count({
      where: { ...whereCondition },
    });
  }
}
