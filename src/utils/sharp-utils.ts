import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';

export class SharpUtils {
  static async savePhotoProfile(filePath: string): Promise<string> {
    const rootDirectory = path.resolve(__dirname, '..', '..');
    const relativeDirectory = path.join('uploads', 'users', 'photo-profile');
    const absoluteDirectory = path.join(rootDirectory, relativeDirectory);

    if (!fs.existsSync(absoluteDirectory)) {
      fs.mkdirSync(absoluteDirectory, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${uuid()}_${timestamp}.jpg`;
    const outputFilePath = path.join(absoluteDirectory, filename);

    await sharp(filePath)
      .resize(400, 400)
      .toFormat('jpg')
      .toFile(outputFilePath);

    fs.unlinkSync(filePath);

    const relativePath = path.join('users', 'photo-profile', filename);

    return relativePath.replace(/\\/g, '/');
  }

  static async resizeImage(imagePath: string): Promise<string> {
    const dir = path.dirname(imagePath);
    const extension = path.extname(imagePath);
    const name = path.basename(imagePath, extension);

    const newImagePath = path.join(dir, `resized_${name}${extension}`);
    await sharp(imagePath).resize(1920, 1080).toFile(newImagePath);

    fs.unlinkSync(imagePath);

    return newImagePath;
  }
}
