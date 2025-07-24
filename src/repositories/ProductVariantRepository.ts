import type { Prisma } from '@prisma/client';
import { db } from '../configs/database';

export class ProductVariantRepository {
  static async create(
    data: Prisma.ProductVariantCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.productVariant.create({
      data: data,
      include: { packaging: true },
    });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.findUnique({
      where: { id },
      include: { packaging: true },
    });
  }

  static async findAll(productId: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.findMany({
      where: {
        productId: productId,
      },
      orderBy: { createdAt: 'desc' },
      include: { packaging: true },
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
      include: { packaging: true },
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
      include: { packaging: true },
    });
  }

  static async delete(id: string, tx: Prisma.TransactionClient = db) {
    return tx.productVariant.delete({
      where: { id },
      include: { packaging: true },
    });
  }
}
