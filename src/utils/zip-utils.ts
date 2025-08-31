import archiver from 'archiver';
import { PassThrough } from 'stream';
import type { Response } from 'express';

export interface ZipFileEntry {
  name: string;
  content: Buffer | string;
}

export class ZipUtils {
  // Pipe a set of files as ZIP to an Express response
  static async pipeZipToResponse(
    res: Response,
    files: ZipFileEntry[],
    zipFilename: string,
  ): Promise<void> {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${zipFilename}"`,
    );

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err: any) => {
      throw err;
    });

    archive.pipe(res);
    for (const file of files) {
      archive.append(file.content, { name: file.name });
    }
    await archive.finalize();
  }

  // Create a ZIP buffer from files (useful for tests or further processing)
  static async createZipBuffer(files: ZipFileEntry[]): Promise<Buffer> {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
      archive.on('error', reject);

      archive.pipe(stream);
      for (const file of files) {
        archive.append(file.content, { name: file.name });
      }
      archive.finalize().catch(reject);
    });
  }
}
