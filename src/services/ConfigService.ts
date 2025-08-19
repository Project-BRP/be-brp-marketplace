import fs from 'fs';
import path from 'path';
import { ResponseError } from '../error/ResponseError';
import { StatusCodes } from 'http-status-codes';

import { CompanyInfoRepository } from './../repositories';
import { IUploadLogoRequest, IUploadLogoResponse } from '../dtos';
import { SharpUtils } from '../utils';
import { db } from '../configs/database';

export class ConfigService {
  static async uploadLogo(
    request: IUploadLogoRequest,
  ): Promise<IUploadLogoResponse> {
    const mainDirectory = process.env.UPLOADS_PATH;
    const logoPath = path.join(__dirname, '..', '..', mainDirectory, 'logo');

    if (!fs.existsSync(logoPath)) {
      fs.mkdirSync(logoPath, { recursive: true });
    }

    const files = fs.readdirSync(logoPath);

    if (files.length > 0) {
      for (const file of files) {
        const filePath = path.join(logoPath, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const resizedLogoPath = await SharpUtils.saveLogo(request.logoPath);
    const dbConnection = db;

    try {
      const beginTransaction = await dbConnection.$transaction(async tx => {
        const existingCompanyInfo = await CompanyInfoRepository.findFirst(tx);

        if (!existingCompanyInfo) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Informasi perusahaan belum dibuat',
          );
        }

        const updateData = {
          logoUrl: resizedLogoPath,
        };

        await CompanyInfoRepository.update(
          existingCompanyInfo.id,
          updateData,
          tx,
        );

        return {
          resizedLogoPath,
        };
      });

      return beginTransaction;
    } catch (error) {
      throw error;
    }
  }

  static async getLogo(): Promise<string> {
    const mainDirectory = process.env.UPLOADS_PATH;
    const logoPath = path.join(__dirname, '..', '..', mainDirectory, 'logo');
    const files = fs.readdirSync(logoPath);

    if (files.length === 0) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Logo tidak ditemukan');
    }

    const logoFile = files[0];
    const logoUrl = path.join('logo', logoFile).replace(/\\/g, '/');

    return logoUrl;
  }
}
