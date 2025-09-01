import fs from 'fs';

export class FileTypeUtils {
  private static readMagicBytes(filePath: string, length = 12): Buffer {
    const fd = fs.openSync(filePath, 'r');
    try {
      const buffer = Buffer.alloc(length);
      fs.readSync(fd, buffer, 0, length, 0);
      return buffer;
    } finally {
      fs.closeSync(fd);
    }
  }

  private static isJpeg(buf: Buffer): boolean {
    // JPEG magic: FF D8 FF
    return (
      buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
    );
  }

  private static isPng(buf: Buffer): boolean {
    // PNG magic: 89 50 4E 47 0D 0A 1A 0A
    const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (buf.length < sig.length) return false;
    for (let i = 0; i < sig.length; i++) if (buf[i] !== sig[i]) return false;
    return true;
  }

  static isValidImage(filePath: string): boolean {
    const header = this.readMagicBytes(filePath);
    return this.isJpeg(header) || this.isPng(header);
  }
}
