import { z, ZodType } from 'zod';

export class TransactionValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z
      .string({
        required_error: 'User ID tidak boleh kosong',
        invalid_type_error: 'User ID tidak valid',
      })
      .min(1, 'User ID tidak boleh kosong'),
  });

  static readonly NOTIF: ZodType = z.object({
    transactionId: z.string(),
    signatureKey: z.string(),
    transactionStatus: z.string(),
    fraudStatus: z.string(),
    statusCode: z.string(),
    grossAmount: z.string(),
    paymentType: z.string(),
  });
}
