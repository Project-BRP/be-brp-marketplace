import { z, ZodType } from 'zod';

export class ProductVariantValidation {
  static readonly CREATE: ZodType = z.object({
    productId: z
      .string({
        required_error: 'ID Produk tidak boleh kosong',
        invalid_type_error: 'ID Produk tidak valid',
      })
      .min(1, 'ID Produk tidak boleh kosong'),
    weight: z
      .string({
        required_error: 'Berat tidak boleh kosong',
        invalid_type_error: 'Berat tidak valid',
      })
      .min(1, 'Berat tidak boleh kosong'),
    composition: z
      .string({
        required_error: 'Komposisi tidak boleh kosong',
        invalid_type_error: 'Komposisi tidak valid',
      })
      .min(1, 'Komposisi tidak boleh kosong'),
    packagingId: z.string().optional(),
    imageUrl: z.string().url('URL gambar tidak valid').optional(),
    priceRupiah: z
      .number({
        required_error: 'Harga tidak boleh kosong',
        invalid_type_error: 'Harga tidak valid',
      })
      .min(0, 'Harga tidak boleh negatif'),
  });

  static readonly UPDATE: ZodType = z
    .object({
      id: z
        .string({
          required_error: 'ID Varian tidak boleh kosong',
          invalid_type_error: 'ID Varian tidak valid',
        })
        .min(1, 'ID Varian tidak boleh kosong'),
      weight: z.string().optional(),
      composition: z.string().optional(),
      packagingId: z.string().optional(),
      imageUrl: z.string().url('URL gambar tidak valid').optional(),
      priceRupiah: z.number().min(0, 'Harga tidak boleh negatif').optional(),
    })
    .refine(data => Object.keys(data).some(key => key !== 'id'), {
      message: 'Setidaknya satu field harus diisi untuk update',
      path: [],
    });

  static readonly GET_ALL: ZodType = z.object({
    productId: z
      .string({
        required_error: 'ID Produk tidak boleh kosong',
        invalid_type_error: 'ID Produk tidak valid',
      })
      .min(1, 'ID Produk tidak boleh kosong'),
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
        required_error: 'ID Varian tidak boleh kosong',
        invalid_type_error: 'ID Varian tidak valid',
      })
      .min(1, 'ID Varian tidak boleh kosong'),
  });
}
