export interface ICreateProductVariantRequest {
  productId: string;
  weight: string;
  composition: string;
  packagingId: string;
  imageUrl: string;
  priceRupiah: number;
}

export interface ICreateProductVariantResponse {
  id: string;
  productId: string;
  weight: string;
  composition: string;
  packagingId: string;
  imageUrl: string;
  priceRupiah: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetProductVariantRequest {
  id: string;
}

export interface IGetProductVariantResponse {
  id: string;
  productId: string;
  weight: string;
  composition: string;
  packagingId: string;
  imageUrl: string;
  priceRupiah: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetAllProductVariantsRequest {
  productId: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IGetAllProductVariantsResponse {
  totalPage: number;
  currentPage: number;
  variants: IGetProductVariantResponse[];
}

export interface IUpdateProductVariantRequest {
  id: string;
  weight?: string;
  composition?: string;
  packagingId?: string;
  imageUrl?: string;
  priceRupiah?: number;
}

export interface IUpdateProductVariantResponse {
  id: string;
  productId: string;
  weight: string;
  composition: string;
  packagingId: string;
  imageUrl: string;
  priceRupiah: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeleteProductVariantRequest {
  id: string;
}
