import {
  type Request,
  type Response,
  type NextFunction,
  response,
} from 'express';
import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

import { ResponseError } from '../error/ResponseError';
import { SharpUtils } from '../utils';
import { successResponse } from '../utils/api-response';
import { ConfigService } from '../services';
import { IUploadLogoRequest } from 'dtos';

export class ConfigController {
  static async uploadLogo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let resizedImagePath: string | undefined;

    try {
      if (req.file) {
        const uploadRequest: IUploadLogoRequest = {
          logoPath: req.file.path,
        };
        const response = await ConfigService.uploadLogo(uploadRequest);
        resizedImagePath = response.resizedLogoPath;
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
