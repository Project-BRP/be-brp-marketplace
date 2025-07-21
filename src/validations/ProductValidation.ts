import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1, 'Nama produk tidak boleh kosong').max(255, 'Nama produk terlalu panjang'),
    description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
    productTypeId: z.string().min(1, 'ID Tipe Produk tidak boleh kosong'),
    storageInstructions: z.string().min(1, 'Instruksi penyimpanan tidak boleh kosong'),
    expiredDurationInYears: z.number().min(0, 'Durasi kadaluarsa tidak boleh negatif'),
    usageInstructions: z.string().min(1, 'Instruksi penggunaan tidak boleh kosong'),
    benefits: z.string().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1, 'ID Produk tidak boleh kosong'),
    name: z.string().max(255, 'Nama produk terlalu panjang').optional(),
    description: z.string().optional(),
    productTypeId: z.string().optional(),
    storageInstructions: z.string().optional(),
    expiredDurationInYears: z.number().min(0, 'Durasi kadaluarsa tidak boleh negatif').optional(),
    usageInstructions: z.string().optional(),
    benefits: z.string().optional(),
  }).refine(data => Object.keys(data).some(key => key !== 'productId'), {
    message: 'Setidaknya satu field harus diisi untuk update',
    path: [],
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z.string().min(1, 'ID Produk tidak boleh kosong'),
  });

  static readonly GET_ALL: ZodType = z.object({
    search: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).optional(),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().min(1, 'ID Produk tidak boleh kosong'),
  });
}