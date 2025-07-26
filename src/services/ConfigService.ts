import fs from 'fs';
import path from 'path';
import { ResponseError } from '../error/ResponseError';
import { StatusCodes } from 'http-status-codes';

export class ConfigService {
  static async uploadLogo(): Promise<void> {
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
