import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { upload } from '../configs/multer';
import { FileTypeUtils, errorResponse } from '../utils';
import { ResponseError } from '../error/ResponseError';
import { StatusCodes } from 'http-status-codes';

// ===== Helper untuk hapus file =====
function cleanupFiles(files: Express.Multer.File[] | undefined) {
  if (!files) return;
  for (const f of files) {
    if (f.path && fs.existsSync(f.path)) {
      try {
        fs.unlinkSync(f.path);
      } catch {}
    }
  }
}

// ===== Single upload =====
const uploadSingle = upload.single('image');

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadSingle(req, res, (error: any) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return errorResponse(
          res,
          new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Gambar tidak boleh lebih dari 5 MB',
          ),
        );
      }
      return errorResponse(res, error);
    }

    try {
      if (req.file && req.file.path) {
        const isValid = FileTypeUtils.isValidImage(req.file.path);
        if (!isValid) {
          cleanupFiles([req.file]);
          return errorResponse(
            res,
            new ResponseError(StatusCodes.BAD_REQUEST, 'Tipe file tidak valid'),
          );
        }
      }
      next();
    } catch (e) {
      cleanupFiles(req.file ? [req.file] : undefined);
      errorResponse(
        res,
        new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Gagal memproses file upload',
        ),
      );
    }
  });
};

// ===== Multiple upload (array) =====
export const uploadArraysMiddleware = (fieldName: string, maxCount: number) => {
  const uploadArray = upload.array(fieldName, maxCount);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadArray(req, res, (error: any) => {
      if (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return errorResponse(
            res,
            new ResponseError(
              StatusCodes.BAD_REQUEST,
              'Salah satu file lebih dari 5 MB',
            ),
          );
        }
        return errorResponse(res, error);
      }

      try {
        const files = (req as any).files as Express.Multer.File[] | undefined;
        if (files && files.length > 0) {
          for (const f of files) {
            // cek size manual
            if (f.size > 5 * 1024 * 1024) {
              cleanupFiles(files);
              return errorResponse(
                res,
                new ResponseError(
                  StatusCodes.BAD_REQUEST,
                  'Tidak boleh ada gambar yang lebih dari 5 MB',
                ),
              );
            }

            // cek tipe valid
            if (!FileTypeUtils.isValidImage(f.path)) {
              cleanupFiles(files);
              return errorResponse(
                res,
                new ResponseError(
                  StatusCodes.BAD_REQUEST,
                  'Tipe file tidak valid',
                ),
              );
            }
          }
        }
        next();
      } catch (e) {
        const files = (req as any).files as Express.Multer.File[] | undefined;
        cleanupFiles(files);
        errorResponse(
          res,
          new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Gagal memproses file upload',
          ),
        );
      }
    });
  };
};
