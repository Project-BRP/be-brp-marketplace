import { z, ZodType } from 'zod';

export class ProductVariantValidation {
  static readonly CREATE: ZodType = z.object({
    productId: z.string().min(1, 'ID Produk tidak boleh kosong'),
    weight: z.string().min(1, 'Berat tidak boleh kosong'),
    composition: z.string().min(1, 'Komposisi tidak boleh kosong'),
    packagingId: z.string().optional(), // Optional
    imageUrl: z.string().url('URL gambar tidak valid').optional(),
    priceRupiah: z.number().min(0, 'Harga tidak boleh negatif'),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1, 'ID Varian tidak boleh kosong'),
    weight: z.string().optional(),
    composition: z.string().optional(),
    packagingId: z.string().optional(), 
    imageUrl: z.string().url('URL gambar tidak valid').optional(),
    priceRupiah: z.number().min(0, 'Harga tidak boleh negatif').optional(),
  });

  static readonly GET_ALL: ZodType = z.object({
    productId: z.string().min(1, 'ID Produk tidak boleh kosong'),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().min(1, 'ID Varian tidak boleh kosong'),
  });
}