import { z, ZodType } from 'zod';

export class TransactionValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z
      .string({
        required_error: 'User ID tidak boleh kosong',
        invalid_type_error: 'User ID tidak valid',
      })
      .min(1, 'User ID tidak boleh kosong'),
    shippingAddress: z
      .string({
        required_error: 'Alamat pengiriman tidak boleh kosong',
        invalid_type_error: 'Alamat pengiriman tidak valid',
      })
      .min(1, 'Alamat pengiriman tidak boleh kosong'),
    province: z
      .string({
        required_error: 'Provinsi tidak boleh kosong',
        invalid_type_error: 'Provinsi tidak valid',
      })
      .min(1, 'Provinsi tidak boleh kosong'),
    city: z
      .string({
        required_error: 'Kota tidak boleh kosong',
        invalid_type_error: 'Kota tidak valid',
      })
      .min(1, 'Kota tidak boleh kosong'),
    postalCode: z
      .string({
        required_error: 'Kode pos tidak boleh kosong',
        invalid_type_error: 'Kode pos tidak valid',
      })
      .min(1, 'Kode pos tidak boleh kosong'),
    method: z.enum(['DELIVERY', 'MANUAL'], {
      required_error: 'Metode transaksi tidak boleh kosong',
      invalid_type_error: 'Metode transaksi tidak valid',
    }),
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

  static readonly GET_BY_ID: ZodType = z.object({
    userRole: z
      .string({
        required_error: 'User role tidak boleh kosong',
        invalid_type_error: 'User role tidak valid',
      })
      .min(1, 'User role tidak boleh kosong'),
    userId: z
      .string({
        required_error: 'User ID tidak boleh kosong',
        invalid_type_error: 'User ID tidak valid',
      })
      .min(1, 'User ID tidak boleh kosong'),
    id: z
      .string({
        required_error: 'ID tidak boleh kosong',
        invalid_type_error: 'ID tidak valid',
      })
      .min(1, 'ID tidak boleh kosong'),
  });

  static readonly GET_ALL: ZodType = z.object({
    method: z.enum(['DELIVERY', 'MANUAL'], {
      required_error: 'Metode transaksi tidak boleh kosong',
      invalid_type_error: 'Metode transaksi tidak valid',
    }).nullish().optional(),
    search: z
      .string({
        invalid_type_error: 'Pencarian tidak valid',
      })
      .nullish()
      .optional(),
    page: z
      .number({
        invalid_type_error: 'Jumlah halaman tidak valid',
      })
      .nullish()
      .optional(),
    limit: z
      .number({
        invalid_type_error: 'Jumlah limit tidak valid',
      })
      .nullish()
      .optional(),
  });

  static readonly GET_ALL_BY_USER: ZodType = z.object({
    userId: z
      .string({
        required_error: 'User ID tidak boleh kosong',
        invalid_type_error: 'User ID tidak valid',
      })
      .min(1, 'User ID tidak boleh kosong'),
    currentUserId: z
      .string({
        required_error: 'Current User ID tidak boleh kosong',
        invalid_type_error: 'Current User ID tidak valid',
      })
      .min(1, 'Current User ID tidak boleh kosong'),
    currentUserRole: z
      .string({
        required_error: 'Current User Role tidak boleh kosong',
        invalid_type_error: 'Current User Role tidak valid',
      })
      .min(1, 'Current User Role tidak boleh kosong'),
    method: z.enum(['DELIVERY', 'MANUAL'], {
      required_error: 'Metode transaksi tidak boleh kosong',
      invalid_type_error: 'Metode transaksi tidak valid',
    }).nullish().optional(),
    search: z
      .string({
        invalid_type_error: 'Pencarian tidak valid',
      })
      .nullish()
      .optional(),
    page: z
      .number({
        invalid_type_error: 'Jumlah halaman tidak valid',
      })
      .nullish()
      .optional(),
    limit: z
      .number({
        invalid_type_error: 'Jumlah limit tidak valid',
      })
      .nullish()
      .optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z
      .string({
        required_error: 'ID transaksi tidak boleh kosong',
        invalid_type_error: 'ID transaksi tidak valid',
      })
      .min(1, 'ID transaksi tidak boleh kosong'),
    deliveryStatus: z.string().optional(),
    manualStatus: z.string().optional(),
  });

  static readonly CANCEL: ZodType = z.object({
    id: z
      .string({
        required_error: 'ID transaksi tidak boleh kosong',
        invalid_type_error: 'ID transaksi tidak valid',
      })
      .min(1, 'ID transaksi tidak boleh kosong'),
    userId: z
      .string({
        required_error: 'User ID tidak boleh kosong',
        invalid_type_error: 'User ID tidak valid',
      })
      .min(1, 'User ID tidak boleh kosong'),
    userRole: z
      .string({
        required_error: 'User role tidak boleh kosong',
        invalid_type_error: 'User role tidak valid',
      })
      .min(1, 'User role tidak boleh kosong'),
    cancelReason: z
      .string({
        required_error: 'Alasan pembatalan tidak boleh kosong',
        invalid_type_error: 'Alasan pembatalan tidak valid',
      })
      .min(1, 'Alasan pembatalan tidak boleh kosong'),
  });
}
