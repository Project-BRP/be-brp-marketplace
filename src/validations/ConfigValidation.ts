import { z, ZodType } from 'zod';

export class ConfigValidation {
  static UPLOAD_LOGO = z.object({
    logoPath: z
      .string({
        required_error: 'Logo tidak boleh kosong',
        invalid_type_error: 'Logo tidak valid',
      })
      .min(1, 'Logo tidak boleh kosong'),
  });
}
