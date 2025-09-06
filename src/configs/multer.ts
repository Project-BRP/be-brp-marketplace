import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
// eslint-disable-next-line
import multer, { FileFilterCallback } from 'multer';

import { ResponseError } from '../error/ResponseError';
import fs from 'fs';
import path from 'path';

const dir = process.env.UPLOADS_PATH;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!dir) {
      return callback(
        new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Internal Server Error!',
        ),
        null,
      );
    }
    // Ensure directory exists, create if not
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Tipe file yang diizinkan

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new ResponseError(
        StatusCodes.BAD_REQUEST,
        'Tipe file yang didukung hanya jpg, jpeg, dan png',
      ),
    );
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5, // Contoh: 5MB maksimal ukuran file
};

export const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});
