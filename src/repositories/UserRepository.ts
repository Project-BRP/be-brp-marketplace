import { TxDeliveryStatus, TxManualStatus, type Prisma } from '@prisma/client';

import { db } from '../configs/database';

import { TimeUtils } from '../utils';

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
    const cancelled = TxDeliveryStatus.CANCELLED;
    const unpaid = TxManualStatus.UNPAID;

    return tx.user.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            transaction: true,
          },
        },
        transaction: {
          where: {
            createdAt: {
              gte: new Date(
                TimeUtils.now().getTime() - 30 * 24 * 60 * 60 * 1000,
              ),
            },
            AND: [
              { deliveryStatus: { notIn: [cancelled, unpaid] } },
              { manualStatus: { notIn: [cancelled, unpaid] } },
            ],
          },
          select: { id: true },
          take: 1,
        },
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
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    const cancelled = TxDeliveryStatus.CANCELLED;
    const unpaid = TxManualStatus.UNPAID;

    return tx.user.findMany({
      where: {
        ...searchCondition,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { transaction: true } },
        transaction: {
          where: {
            createdAt: {
              gte: new Date(
                TimeUtils.now().getTime() - 30 * 24 * 60 * 60 * 1000,
              ),
            },
            AND: [
              { deliveryStatus: { notIn: [cancelled, unpaid] } },
              { manualStatus: { notIn: [cancelled, unpaid] } },
            ],
          },
          select: { id: true },
          take: 1,
        },
      },
    });
  }

  static async findAll(search?: string, tx: Prisma.TransactionClient = db) {
    const searchCondition = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
              email: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    const cancelled = TxDeliveryStatus.CANCELLED;
    const unpaid = TxManualStatus.UNPAID;

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
        transaction: {
          where: {
            createdAt: {
              gte: new Date(
                TimeUtils.now().getTime() - 30 * 24 * 60 * 60 * 1000,
              ),
            },
            AND: [
              { deliveryStatus: { notIn: [cancelled, unpaid] } },
              { manualStatus: { notIn: [cancelled, unpaid] } },
            ],
          },
          select: { id: true },
          take: 1,
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

  // Di dalam UserRepository.ts atau di mana pun fungsi ini berada

  static async countActiveUsers(
    startDate: Date,
    endDate: Date,
    tx: Prisma.TransactionClient = db,
  ): Promise<number> {
    const cancelled = TxDeliveryStatus.CANCELLED.toString();
    const unpaid = TxManualStatus.UNPAID.toString();

    const result: { active_users: number }[] = await tx.$queryRaw`
    SELECT
      COUNT(DISTINCT "user_id")::integer AS active_users
    FROM
      transactions
    WHERE
      "delivery_status"::text NOT IN (${cancelled}, ${unpaid})
      AND "manual_status"::text NOT IN (${cancelled}, ${unpaid})
      AND "created_at" >= ${startDate}
      AND "created_at" <= ${endDate};
  `;

    return result[0]?.active_users || 0;
  }

  static async delete(id: string, tx: Prisma.TransactionClient = db) {
    return tx.user.delete({
      where: {
        id: id,
      },
    });
  }
}
