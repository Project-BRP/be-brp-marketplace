import axios from 'axios';

import { MIDTRANS_SECRET } from '../constants';
import { CLIENT_URL_CURRENT } from './client-url-utils';
import { ResponseError } from '../error/ResponseError';

export class PaymentUtils {
  static async sendToPaymentGateway(
    transactionId: string,
    grossAmount: number,
    transactionItems: {
      variantId: string;
      variantName: string;
      productId: string;
      quantity: number;
      priceRupiah: number;
      productName: string;
    }[],
    customerDetails: {
      name: string;
      email: string;
    },
  ): Promise<any> {
    const authString = btoa(`${MIDTRANS_SECRET.MIDTRANS_SERVER_KEY}:`);
    
    const itemDetails = transactionItems.map(item => ({
      id: item.variantId,
      price: item.priceRupiah,
      quantity: item.quantity,
      name: item.productName,
      variant_name: item.variantName,
      product_id: item.productId,
    }));

    const transactionPayload = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        name: customerDetails.name,
        email: customerDetails.email,
      },
      callbacks: {
        finish: `${CLIENT_URL_CURRENT}/transaction?transaction_id=${transactionId}`,
        error: `${CLIENT_URL_CURRENT}/transaction?transaction_id=${transactionId}`,
        pending: `${CLIENT_URL_CURRENT}/transaction?transaction_id=${transactionId}`,
      },
    };

    try {
      const response = await axios.post(
        `${MIDTRANS_SECRET.MIDTRANS_APP_URL}`,
        transactionPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Basic ${authString}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Midtrans API Error:', error.response?.data);
        throw new ResponseError(
          error.response?.status || 500,
          error.response?.data?.error_messages?.join(', ') || 'Failed to create transaction',
        );
      }

      console.error('Unexpected error in sendToPaymentGateway:', error);
      throw error;
    }
  }
}
