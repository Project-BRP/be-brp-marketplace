export interface ICreateProductTypeRequest {
  name: string;
}

export interface ICreateProductTypeResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetProductTypeRequest {
  productTypeId: string;
}

export interface IGetProductTypeResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetAllProductTypesRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IGetAllProductTypesResponse {
  totalPage: number;
  currentPage: number;
  productTypes: IGetProductTypeResponse[];
}

export interface IUpdateProductTypeRequest {
  productTypeId: string;
  name: string;
}

export interface IUpdateProductTypeResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeleteProductTypeRequest {
  productTypeId: string;
}