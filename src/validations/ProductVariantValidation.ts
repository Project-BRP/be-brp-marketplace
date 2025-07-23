import { z, ZodType } from 'zod';

export class ProductVariantValidation {
  static readonly CREATE: ZodType = z.object({
    productId: z
      .string({
        required_error: 'ID Produk tidak boleh kosong',
        invalid_type_error: 'ID Produk tidak valid',
      })
      .min(1, 'ID Produk tidak boleh kosong'),
    weight_in_kg: z
      .string({
        required_error: 'Berat tidak boleh kosong',
        invalid_type_error: 'Berat tidak valid',
      })
      .min(1, 'Berat tidak boleh kosong'),
    packagingId: z.string({
      required_error: 'ID Kemasan tidak boleh kosong',
      invalid_type_error: 'ID Kemasan tidak valid',
    }),
    imageUrl: z.string({
      required_error: 'URL gambar tidak boleh kosong',
      invalid_type_error: 'URL gambar tidak valid',
    }),
    priceRupiah: z.preprocess(
      val => {
        if (
          val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '')
        ) {
          return undefined;
        }
        const num = Number(val);
        return Number.isNaN(num) ? undefined : num;
      },
      z
        .number({
          required_error: 'Harga tidak boleh kosong',
          invalid_type_error: 'Harga tidak valid',
        })
        .min(0, 'Harga tidak boleh negatif'),
    ),
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z
      .string({
        required_error: 'ID Varian tidak boleh kosong',
        invalid_type_error: 'ID Varian tidak valid',
      })
      .min(1, 'ID Varian tidak boleh kosong'),
  });

  static readonly UPDATE: ZodType = z
    .object({
      id: z
        .string({
          required_error: 'ID Varian tidak boleh kosong',
          invalid_type_error: 'ID Varian tidak valid',
        })
        .min(1, 'ID Varian tidak boleh kosong'),
      weight_in_kg: z.string().optional(),
      packagingId: z.string().optional(),
      imageUrl: z.string().optional(),
      priceRupiah: z.preprocess(
        val => {
          if (
            val === undefined ||
            val === null ||
            (typeof val === 'string' && val.trim() === '')
          ) {
            return undefined;
          }
          const num = Number(val);
          return Number.isNaN(num) ? undefined : num;
        },
        z
          .number({
            invalid_type_error: 'Harga tidak valid',
          })
          .min(0, 'Harga tidak boleh negatif')
          .optional(),
      ),
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
