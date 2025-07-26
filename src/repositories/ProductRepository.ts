import type { Prisma } from '@prisma/client';
import { db } from '../configs/database';

export class ProductRepository {
  static async create(
    data: Prisma.ProductCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.product.create({
      data: data,
    });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.product.findUnique({
      where: { id },
      include: {
        productType: true,
        productVariants: true,
      },
    });
  }

  static async findByName(
    name: string,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.product.findFirst({
      where: {
        name: name,
      },
    });
  }

  static async findAllWithPagination(
    skip: number,
    take: number,
    search?: string,
    productTypeId?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const whereCondition: Prisma.ProductWhereInput = {};

    if (search) {
      whereCondition.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (productTypeId) {
      whereCondition.productTypeId = productTypeId;
    }

    return tx.product.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      include: {
        productType: true,
        productVariants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async count(
    search?: string,
    productTypeId?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const whereCondition: Prisma.ProductWhereInput = {};

    if (search) {
      whereCondition.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (productTypeId) {
      whereCondition.productTypeId = productTypeId;
    }

    return tx.product.count({
      where: whereCondition,
    });
  }

  static async findAll(
    search?: string,
    productTypeId?: string,
    tx: Prisma.TransactionClient = db,
  ) {
    const whereCondition: Prisma.ProductWhereInput = {};

    if (search) {
      whereCondition.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (productTypeId) {
      whereCondition.productTypeId = productTypeId;
    }

    return tx.product.findMany({
      where: whereCondition,
      include: {
        productType: true,
        productVariants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async update(
    id: string,
    data: Prisma.ProductUpdateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.product.update({
      where: { id },
      data: data,
    });
  }

  static async delete(id: string, tx: Prisma.TransactionClient = db) {
    return tx.product.delete({
      where: { id },
    });
  }
}
