import { z, ZodType } from 'zod';

export class ChatValidation {
  static readonly CREATE_MESSAGE: ZodType = z.object({
    userId: z
      .string({ invalid_type_error: 'User ID tidak valid' })
      .min(1, 'User ID tidak boleh kosong')
      .optional(),
    content: z
      .string({ invalid_type_error: 'Konten tidak valid' })
      .min(1, 'Konten tidak boleh kosong')
      .optional(),
  });
}
