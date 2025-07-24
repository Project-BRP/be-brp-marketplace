import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';

export class SharpUtils {
  static async savePhotoProfile(filePath: string): Promise<string> {
    const rootDirectory = path.resolve(__dirname, '..', '..');
    const mainDirectory = process.env.UPLOADS_PATH;
    const relativeDirectory = path.join(
      mainDirectory,
      'users',
      'photo-profile',
    );
    const absoluteDirectory = path.join(rootDirectory, relativeDirectory);

    if (!fs.existsSync(absoluteDirectory)) {
      fs.mkdirSync(absoluteDirectory, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${uuid()}_${timestamp}.webp`;
    const outputFilePath = path.join(absoluteDirectory, filename);

    await sharp(filePath)
      .resize(400, 400)
      .toFormat('webp')
      .toFile(outputFilePath);

    fs.unlinkSync(filePath);

    const relativePath = path.join('users', 'photo-profile', filename);
    return relativePath.replace(/\\/g, '/');
  }

  static async saveProductVariantImage(filePath: string): Promise<string> {
    const rootDirectory = path.resolve(__dirname, '..', '..');
    const mainDirectory = process.env.UPLOADS_PATH;
    const relativeDirectory = path.join(mainDirectory, 'products', 'variants');
    const absoluteDirectory = path.join(rootDirectory, relativeDirectory);

    if (!fs.existsSync(absoluteDirectory)) {
      fs.mkdirSync(absoluteDirectory, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${uuid()}_${timestamp}.webp`;
    const outputFilePath = path.join(absoluteDirectory, filename);

    await sharp(filePath)
      .resize(1920, 1080)
      .toFormat('webp')
      .toFile(outputFilePath);

    fs.unlinkSync(filePath);

    const relativePath = path.join('products', 'variants', filename);
    return relativePath.replace(/\\/g, '/');
  }

  // Tambahkan fungsi ini untuk gambar produk utama
  static async saveProductImage(filePath: string): Promise<string> {
    const rootDirectory = path.resolve(__dirname, '..', '..');
    const mainDirectory = process.env.UPLOADS_PATH;
    const relativeDirectory = path.join(mainDirectory, 'products', 'main');
    const absoluteDirectory = path.join(rootDirectory, relativeDirectory);

    if (!fs.existsSync(absoluteDirectory)) {
      fs.mkdirSync(absoluteDirectory, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${uuid()}_${timestamp}.webp`;
    const outputFilePath = path.join(absoluteDirectory, filename);

    await sharp(filePath)
      .resize(1920, 1080)
      .toFormat('webp')
      .toFile(outputFilePath);

    fs.unlinkSync(filePath);

    const relativePath = path.join('products', 'main', filename);
    return relativePath.replace(/\\/g, '/');
  }
}
