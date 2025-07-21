import { z, ZodType } from 'zod';

export class ProductTypeValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1, 'Nama tipe produk tidak boleh kosong').max(255, 'Nama tipe produk terlalu panjang'),
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z.string().min(1, 'ID Tipe Produk tidak boleh kosong'),
  });

  static readonly GET_ALL: ZodType = z.object({
    search: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).optional(),
  });
  
  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1, 'ID Tipe Produk tidak boleh kosong'),
    name: z.string().min(1, 'Nama tipe produk tidak boleh kosong').max(255, 'Nama tipe produk terlalu panjang'),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().min(1, 'ID Tipe Produk tidak boleh kosong'),
  });
}
