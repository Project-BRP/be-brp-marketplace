import { TxDeliveryStatus, TxManualStatus, TxMethod } from '@prisma/client';

export interface ICreateTransactionRequest {
  userId: string;
  city: string;
  province: string;
  postalCode: string;
  shippingAddress: string;
  method: TxMethod;
}

export interface ICreateTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  method: TxMethod;
  deliveryStatus?: TxDeliveryStatus;
  manualStatus?: TxManualStatus;
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
  shippingCost?: number;
  paymentMethod?: string;
  isRefundFailed?: boolean;
  cancelReason?: string;
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
  method: TxMethod;
  deliveryStatus?: TxDeliveryStatus;
  manualStatus?: TxManualStatus;
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
  isRefundFailed?: boolean;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetAllTransactionsRequest {
  page?: number;
  limit?: number;
  method?: TxMethod;
  search?: string;
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
  method?: TxMethod;
  search?: string;
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
  deliveryStatus?: TxDeliveryStatus;
  manualStatus?: TxManualStatus;
}

export interface IUpdateTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  method: TxMethod;
  deliveryStatus?: TxDeliveryStatus;
  manualStatus?: TxManualStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage?: number;
  snapToken?: string;
  snapUrl?: string;
  shippingAddress?: string;
  shippingCost?: number;
  paymentMethod?: string;
  isRefunndFailed?: boolean;
  cancelReason?: string;
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
  method: TxMethod;
  deliveryStatus?: TxDeliveryStatus;
  manualStatus?: TxManualStatus;
  cleanPrice: number;
  priceWithPPN: number;
  totalPrice: number;
  PPNPercentage?: number;
  snapToken?: string;
  snapUrl?: string;
  shippingAddress?: string;
  shippingCost?: number;
  paymentMethod?: string;
  isRefundFailed?: boolean;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetTxStatusListResponse {
  deliveryStatusList: TxDeliveryStatus[];
  manualStatusList: TxManualStatus[];
}

export interface IGetTxMethodListResponse {
  txMethodList: TxMethod[];
}

export interface ITransactionNotifRequest {
  transactionId: string;
  transactionStatus: string;
  fraudStatus: string;
  statusCode: string;
  grossAmount: string;
  paymentType: string;
}
