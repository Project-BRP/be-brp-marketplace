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
      packagingId: newProductVariant.packagingId,
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

    const updatedProductVariant = await ProductVariantRepository.update(
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
      packagingId: updatedProductVariant.packagingId,
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
      packagingId: productVariant.packagingId,
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
          packagingId: variant.packagingId,
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
        packagingId: variant.packagingId,
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

    await ProductVariantRepository.delete(validData.id);
  }
}
