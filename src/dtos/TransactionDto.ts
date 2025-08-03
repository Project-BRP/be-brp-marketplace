import { TxStatus } from '@prisma/client';

export interface ICreateTransactionRequest {
  userId: string;
  city: string;
  province: string;
  postalCode: string;
  shippingAddress: string;
}

export interface ICreateTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  status: TxStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage?: number;
  snapToken?: string;
  snapUrl?: string;
  city: string;
  province: string;
  postalCode: string;
  shippingAddress: string;
  shippingCost: number;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetTransactionRequest {
  id: string;
  userId: string;
  userRole: string;
}

export interface IGetTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  status: TxStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage?: number;
  snapToken?: string;
  snapUrl?: string;
  shippingAddress?: string;
  shippingCost?: number;
  paymentMethod?: string;
  transactionItems: {
    id: string;
    quantity: number;
    priceRupiah: number;
    isStockIssue: boolean;
    variant: {
      id: string;
      weight_in_kg: number;
      imageUrl?: string;
      priceRupiah: number;
      product: {
        id: string;
        name: string;
        imageUrl?: string;
      };
      packaging?: {
        id: string;
        name: string;
      };
      stock: number;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetAllTransactionsRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IGetAllTransactionsResponse {
  totalPage: number;
  currentPage: number;
  transactions: IGetTransactionResponse[];
}

export interface IGetTransactionByUserRequest {
  userId: string;
  currentUserId: string;
  currentUserRole: string;
  page?: number;
  limit?: number;
}

export interface IGetTransactionByUserResponse {
  totalPage: number;
  currentPage: number;
  transactions: IGetTransactionResponse[];
}

export interface IUpdateTransactionRequest {
  id: string;
  status: TxStatus;
}

export interface IUpdateTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  status: TxStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage?: number;
  snapToken?: string;
  snapUrl?: string;
  shippingAddress?: string;
  shippingCost?: number;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICancelTransactionRequest {
  id: string;
  userId: string;
  cancelReason: string;
  userRole: string;
}

export interface ICancelTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  status: TxStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage?: number;
  snapToken?: string;
  snapUrl?: string;
  shippingAddress?: string;
  shippingCost?: number;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionNotifRequest {
  transactionId: string;
  transactionStatus: string;
  fraudStatus: string;
  statusCode: string;
  grossAmount: string;
  paymentType: string;
}
