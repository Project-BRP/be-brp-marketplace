import { IGetProductVariantResponse } from "./ProductVariantsDto";

export interface ICreateProductRequest {
  name: string;
  description: string;
  productTypeId: string;
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string; 
}

export interface ICreateProductResponse {
  id: string;
  name: string;
  description: string;
  productType: {
    id: string;
    name: string;
  };
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetProductRequest {
  id: string;
}

export interface IGetProductResponse {
  id: string;
  name: string;
  description: string;
  productType?: {
    id: string;
    name: string;
  };
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string; 
  variants: IGetProductVariantResponse[]; 
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetAllProductsRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IGetAllProductsResponse {
  totalPage: number;
  currentPage: number;
  products: IGetProductResponse[];
}

export interface IUpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  productTypeId?: string;
  storageInstructions?: string;
  expiredDurationInYears?: number;
  usageInstructions?: string;
  benefits?: string; 
}

export interface IUpdateProductResponse {
  id: string;
  name: string;
  description: string;
  productType: {
    id: string;
    name: string;
  };
  storageInstructions: string;
  expiredDurationInYears: number;
  usageInstructions: string;
  benefits: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeleteProductRequest {
  id: string;
}
