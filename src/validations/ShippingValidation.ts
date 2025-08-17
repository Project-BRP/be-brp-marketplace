import { z, ZodType } from 'zod';

export class ShippingValidation {
  static readonly GET_CITIES: ZodType = z.object({
    provinceId: z
      .number({
        required_error: 'ID Provinsi tidak boleh kosong',
        invalid_type_error: 'ID Provinsi tidak valid',
      })
      .min(1, 'ID Provinsi tidak boleh kurang dari 1'),
  });

  static readonly GET_DISTRICTS: ZodType = z.object({
    provinceId: z
      .number({
        required_error: 'ID Provinsi tidak boleh kosong',
        invalid_type_error: 'ID Provinsi tidak valid',
      })
      .min(1, 'ID Provinsi tidak boleh kurang dari 1'),
    cityId: z
      .number({
        required_error: 'ID Kota tidak boleh kosong',
        invalid_type_error: 'ID Kota tidak valid',
      })
      .min(1, 'ID Kota tidak boleh kurang dari 1'),
  });

  static readonly GET_SUB_DISTRICTS: ZodType = z.object({
    provinceId: z
      .number({
        required_error: 'ID Provinsi tidak boleh kosong',
        invalid_type_error: 'ID Provinsi tidak valid',
      })
      .min(1, 'ID Provinsi tidak boleh kurang dari 1'),
    cityId: z
      .number({
        required_error: 'ID Kota tidak boleh kosong',
        invalid_type_error: 'ID Kota tidak valid',
      })
      .min(1, 'ID Kota tidak boleh kurang dari 1'),
    districtId: z
      .number({
        required_error: 'ID Kecamatan tidak boleh kosong',
        invalid_type_error: 'ID Kecamatan tidak valid',
      })
      .min(1, 'ID Kecamatan tidak boleh kurang dari 1'),
  });
}
