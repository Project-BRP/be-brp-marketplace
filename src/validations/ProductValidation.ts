import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly CREATE: ZodType = z.object({
    name: z
      .string({
        required_error: 'Nama produk tidak boleh kosong',
        invalid_type_error: 'Nama produk tidak valid',
      })
      .min(1, 'Nama produk tidak boleh kosong')
      .max(255, 'Nama produk terlalu panjang'),
    description: z
      .string({
        required_error: 'Deskripsi tidak boleh kosong',
        invalid_type_error: 'Deskripsi tidak valid',
      })
      .min(1, 'Deskripsi tidak boleh kosong'),
    productTypeId: z
      .string({
        required_error: 'ID Tipe Produk tidak boleh kosong',
        invalid_type_error: 'ID Tipe Produk tidak valid',
      })
      .min(1, 'ID Tipe Produk tidak boleh kosong'),
    storageInstructions: z
      .string({
        required_error: 'Instruksi penyimpanan tidak boleh kosong',
        invalid_type_error: 'Instruksi penyimpanan tidak valid',
      })
      .min(1, 'Instruksi penyimpanan tidak boleh kosong'),
    expiredDurationInYears: z
      .number({
        required_error: 'Durasi kadaluarsa tidak boleh kosong',
        invalid_type_error: 'Durasi kadaluarsa tidak valid',
      })
      .min(0, 'Durasi kadaluarsa tidak boleh negatif'),
    usageInstructions: z
      .string({
        required_error: 'Instruksi penggunaan tidak boleh kosong',
        invalid_type_error: 'Instruksi penggunaan tidak valid',
      })
      .min(1, 'Instruksi penggunaan tidak boleh kosong'),
    benefits: z
      .string({
        required_error: 'Manfaat tidak boleh kosong',
        invalid_type_error: 'Manfaat tidak valid',
      })
      .min(1, 'Manfaat tidak boleh kosong'),
  });

  static readonly UPDATE: ZodType = z
    .object({
      id: z
        .string({
          required_error: 'ID Produk tidak boleh kosong',
          invalid_type_error: 'ID Produk tidak valid',
        })
        .min(1, 'ID Produk tidak boleh kosong'),
      name: z
        .string({
          invalid_type_error: 'Nama produk tidak valid',
        })
        .max(255, 'Nama produk terlalu panjang')
        .optional(),
      description: z
        .string({
          invalid_type_error: 'Deskripsi tidak valid',
        })
        .optional(),
      productTypeId: z
        .string({
          invalid_type_error: 'ID Tipe Produk tidak valid',
        })
        .optional(),
      storageInstructions: z
        .string({
          invalid_type_error: 'Instruksi penyimpanan tidak valid',
        })
        .optional(),
      expiredDurationInYears: z
        .number({
          invalid_type_error: 'Durasi kadaluarsa tidak valid',
        })
        .min(0, 'Durasi kadaluarsa tidak boleh negatif')
        .optional(),
      usageInstructions: z
        .string({
          invalid_type_error: 'Instruksi penggunaan tidak valid',
        })
        .optional(),
      benefits: z.string().optional(),
    })
    .refine(data => Object.keys(data).some(key => key !== 'productId'), {
      message: 'Setidaknya satu field harus diisi untuk update',
      path: [],
    });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z
      .string({
        required_error: 'ID Produk tidak boleh kosong',
        invalid_type_error: 'ID Produk tidak valid',
      })
      .min(1, 'ID Produk tidak boleh kosong'),
  });

  static readonly GET_ALL: ZodType = z.object({
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

  static readonly DELETE: ZodType = z.object({
    id: z
      .string({
        required_error: 'ID Produk tidak boleh kosong',
        invalid_type_error: 'ID Produk tidak valid',
      })
      .min(1, 'ID Produk tidak boleh kosong'),
  });
}
