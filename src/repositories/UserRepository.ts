import type { Prisma } from '@prisma/client';

import { db } from '../configs/database';

// parameter tx diisi jika ingin menggunakan transaction

export class UserRepository {
  static async create(
    data: Prisma.UserCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.user.create({
      data: data,
    });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  static async findAllWithPagination(
    skip: number,
    take: number,
    search?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const searchCondition = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        }
      : {};

    return tx.user.findMany({
      where: {
        ...searchCondition,
      },
      skip: skip,
      take: take,
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        _count: {
          select: {
            transaction: true,
          },
        },
      },
    });
  }

  static async findAll(search?: string, tx: Prisma.TransactionClient = db) {
    const searchCondition = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        }
      : {};

    return tx.user.findMany({
      where: {
        ...searchCondition,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            transaction: true,
          },
        },
      },
    });
  }

  static async count(search?: string, tx: Prisma.TransactionClient = db) {
    const searchCondition = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        }
      : {};

    return tx.user.count({
      where: {
        ...searchCondition,
      },
    });
  }

  static async findByEmail(email: string, tx: Prisma.TransactionClient = db) {
    return tx.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  static async update(
    id: string,
    data: Prisma.UserUpdateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  static async delete(id: string, tx: Prisma.TransactionClient = db) {
    return tx.user.delete({
      where: {
        id: id,
      },
    });
  }
}
