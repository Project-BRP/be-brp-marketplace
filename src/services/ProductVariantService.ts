import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';

import type {
  ICreateProductVariantRequest,
  ICreateProductVariantResponse,
  IUpdateProductVariantRequest,
  IUpdateProductVariantResponse,
  IGetProductVariantRequest,
  IGetProductVariantResponse,
  IGetAllProductVariantsRequest,
  IGetAllProductVariantsResponse,
  IDeleteProductVariantRequest,
} from '../dtos';
import { ResponseError } from '../error/ResponseError';
import {
  ProductRepository,
  PackagingRepository,
  ProductVariantRepository,
} from '../repositories';
import { Validator } from '../utils';
import { ProductVariantValidation } from '../validations';

export class ProductVariantService {
  static async create(
    request: ICreateProductVariantRequest,
  ): Promise<ICreateProductVariantResponse> {
    const validData = Validator.validate(
      ProductVariantValidation.CREATE,
      request,
    );

    const product = await ProductRepository.findById(validData.productId);
    if (!product) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Produk tidak ditemukan');
    }

    let packaging = null;

    if (validData.packagingId) {
      packaging = await PackagingRepository.findById(validData.packagingId);
      if (!packaging) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Kemasan tidak ditemukan',
        );
      }
    }

    const newProductVariant = await ProductVariantRepository.create({
      id: 'PRV-' + uuid(),
      product: {
        connect: { id: validData.productId },
      },
      weight_in_kg: validData.weight_in_kg,
      packaging: {
        connect: { id: validData.packagingId },
      },
      imageUrl: validData.imageUrl,
      priceRupiah: validData.priceRupiah,
    });

    return {
      id: newProductVariant.id,
      productId: newProductVariant.productId,
      weight_in_kg: newProductVariant.weight_in_kg,
      packaging: packaging
        ? {
            id: packaging.id,
            name: packaging.name,
          }
        : undefined,
      imageUrl: newProductVariant.imageUrl,
      priceRupiah: newProductVariant.priceRupiah,
      createdAt: newProductVariant.createdAt,
      updatedAt: newProductVariant.updatedAt,
    };
  }

  static async update(
    request: IUpdateProductVariantRequest,
  ): Promise<IUpdateProductVariantResponse> {
    const validData = Validator.validate(
      ProductVariantValidation.UPDATE,
      request,
    );

    const productVariant = await ProductVariantRepository.findById(
      validData.id,
    );
    if (!productVariant) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Varian produk tidak ditemukan',
      );
    }

    if (validData.packagingId) {
      const packaging = await PackagingRepository.findById(
        validData.packagingId,
      );
      if (!packaging) {
        throw new ResponseError(
          StatusCodes.NOT_FOUND,
          'Kemasan tidak ditemukan',
        );
      }
    }

    let updatedProductVariant;

    if (validData.packagingId) {
      updatedProductVariant = await ProductVariantRepository.update(
        validData.id,
        {
          weight_in_kg: validData.weight_in_kg,
          packaging: {
            connect: { id: validData.packagingId },
          },
          imageUrl: validData.imageUrl,
          priceRupiah: validData.priceRupiah,
        },
      );
      return {
        id: updatedProductVariant.id,
        productId: updatedProductVariant.productId,
        weight_in_kg: updatedProductVariant.weight_in_kg,
        packaging: {
          id: updatedProductVariant.packaging.id,
          name: updatedProductVariant.packaging.name,
        },
        imageUrl: updatedProductVariant.imageUrl,
        priceRupiah: updatedProductVariant.priceRupiah,
        createdAt: updatedProductVariant.createdAt,
        updatedAt: updatedProductVariant.updatedAt,
      };
    }

    updatedProductVariant = await ProductVariantRepository.update(
      validData.id,
      {
        weight_in_kg: validData.weight_in_kg,
        imageUrl: validData.imageUrl,
        priceRupiah: validData.priceRupiah,
      },
    );

    return {
      id: updatedProductVariant.id,
      productId: updatedProductVariant.productId,
      weight_in_kg: updatedProductVariant.weight_in_kg,
      packaging: updatedProductVariant.packaging
        ? {
            id: updatedProductVariant.packaging.id,
            name: updatedProductVariant.packaging.name,
          }
        : undefined,
      imageUrl: updatedProductVariant.imageUrl,
      priceRupiah: updatedProductVariant.priceRupiah,
      createdAt: updatedProductVariant.createdAt,
      updatedAt: updatedProductVariant.updatedAt,
    };
  }

  static async getById(
    request: IGetProductVariantRequest,
  ): Promise<IGetProductVariantResponse> {
    const validData = Validator.validate(
      ProductVariantValidation.GET_BY_ID,
      request,
    );

    const productVariant = await ProductVariantRepository.findById(
      validData.id,
    );
    if (!productVariant) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Varian produk tidak ditemukan',
      );
    }

    return {
      id: productVariant.id,
      productId: productVariant.productId,
      weight_in_kg: productVariant.weight_in_kg,
      packaging: productVariant.packaging
        ? {
            id: productVariant.packaging.id,
            name: productVariant.packaging.name,
          }
        : undefined,
      imageUrl: productVariant.imageUrl,
      priceRupiah: productVariant.priceRupiah,
      createdAt: productVariant.createdAt,
      updatedAt: productVariant.updatedAt,
    };
  }

  static async getAll(
    request: IGetAllProductVariantsRequest,
  ): Promise<IGetAllProductVariantsResponse> {
    const validData = Validator.validate(
      ProductVariantValidation.GET_ALL,
      request,
    );

    const take = validData.limit;
    const skip = (validData.page - 1) * take;
    const productId = validData.productId; // Tetap ambil productId dari validData

    if (!take || !validData.page) {
      // Teruskan productId ke repository
      const productVariants = await ProductVariantRepository.findAll(productId);

      return {
        totalPage: 1,
        currentPage: 1,
        variants: productVariants.map(variant => ({
          id: variant.id,
          productId: variant.productId,
          weight_in_kg: variant.weight_in_kg,
          packaging: variant.packaging
            ? {
                id: variant.packaging.id,
                name: variant.packaging.name,
              }
            : undefined,
          imageUrl: variant.imageUrl,
          priceRupiah: variant.priceRupiah,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
        })),
      };
    }

    // Teruskan productId ke repository
    const totalProductVariants =
      await ProductVariantRepository.count(productId);

    if (totalProductVariants === 0) {
      return {
        totalPage: 1,
        currentPage: 1,
        variants: [],
      };
    }

    if (skip >= totalProductVariants) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Halaman tidak valid');
    }

    // Teruskan productId ke repository
    const productVariants =
      await ProductVariantRepository.findAllWithPagination(
        skip,
        take,
        productId,
      );

    const totalPage = Math.ceil(totalProductVariants / take);
    const currentPage = Math.ceil(skip / take) + 1;

    return {
      totalPage,
      currentPage,
      variants: productVariants.map(variant => ({
        id: variant.id,
        productId: variant.productId,
        weight_in_kg: variant.weight_in_kg,
        packaging: variant.packaging
          ? {
              id: variant.packaging.id,
              name: variant.packaging.name,
            }
          : undefined,
        imageUrl: variant.imageUrl,
        priceRupiah: variant.priceRupiah,
        createdAt: variant.createdAt,
        updatedAt: variant.updatedAt,
      })),
    };
  }

  static async delete(request: IDeleteProductVariantRequest): Promise<void> {
    const validData = Validator.validate(
      ProductVariantValidation.DELETE,
      request,
    );

    const productVariant = await ProductVariantRepository.findById(
      validData.id,
    );
    if (!productVariant) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Varian produk tidak ditemukan',
      );
    }

    const assetDir = process.env.UPLOADS_PATH;

    if (fs.existsSync(`${assetDir}/${productVariant.imageUrl}`)) {
      fs.unlinkSync(`${assetDir}/${productVariant.imageUrl}`);
    }

    await ProductVariantRepository.delete(validData.id);
  }
}
