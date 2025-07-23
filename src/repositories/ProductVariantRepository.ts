import type { Prisma } from '@prisma/client';
import { db } from '../configs/database';

export class ProductVariantRepository {
  static async create(
    data: Prisma.ProductVariantCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.productVariant.create({
      data: data,
    });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.findUnique({
      where: { id },
    });
  }

  static async findAll(productId: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.findMany({
      where: {
        productId: productId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findAllWithPagination(
    skip: number,
    take: number,
    productId: string,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.productVariant.findMany({
      where: {
        productId: productId,
      },
      skip: skip,
      take: take,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async count(productId: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.count({
      where: {
        productId: productId,
      },
    });
  }

  static async update(
    id: string,
    data: Prisma.ProductVariantUpdateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.productVariant.update({
      where: { id },
      data: data,
    });
  }

  static async delete(id: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.delete({
      where: { id },
    });
  }
}
