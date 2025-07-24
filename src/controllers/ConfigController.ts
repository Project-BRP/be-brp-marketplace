import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import { ResponseError } from '../error/ResponseError';
import { StatusCodes } from 'http-status-codes';
import { SharpUtils } from '../utils';
import { successResponse } from '../utils/api-response';
import { ConfigService } from '../services/ConfigService';

export class ConfigController {
  static async uploadLogo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let resizedImagePath: string | undefined;
    
    try {
      await ConfigService.uploadLogo();

      if (req.file) {
        resizedImagePath = await SharpUtils.saveLogo(req.file.path);
      }

      if (!resizedImagePath) {
        throw new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Gagal mengunggah logo perusahaan',
        );
      }

      successResponse(res, 201, 'Logo perusahaan berhasil diunggah', {
        imageUrl: resizedImagePath,
      });
    } catch (error) {
      if (resizedImagePath && fs.existsSync(resizedImagePath)) {
        fs.unlinkSync(resizedImagePath);
      }
      next(error);
    }
  }

  static async getLogo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const logoUrl = await ConfigService.getLogo(); 
      successResponse(res, 200, 'Logo berhasil diambil', { imageUrl: logoUrl });
    } catch (error) {
      next(error);
    }
  }
}
