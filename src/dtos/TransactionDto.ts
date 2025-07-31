import { IGetProductVariantResponse } from './ProductVariantDto';
import { TxStatus } from '@prisma/client';

export interface ICreateTransactionRequest {
  userId: string;
}

export interface ICreateTransactionResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: TxStatus;
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
