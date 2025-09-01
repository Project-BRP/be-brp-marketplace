import type { NextFunction, Request, Response } from 'express';

import { upload } from '../configs/multer';
import { FileTypeUtils, errorResponse } from '../utils';
import fs from 'fs';
import { ResponseError } from '../error/ResponseError';
import { StatusCodes } from 'http-status-codes';

const uploadSingle = upload.single('image');

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadSingle(req, res, (error: any) => {
    if (error) {
      errorResponse(res, error);
    } else {
      try {
        if (req.file && req.file.path) {
          const isValid = FileTypeUtils.isValidImage(req.file.path);
          if (!isValid) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return errorResponse(
              res,
              new ResponseError(
                StatusCodes.BAD_REQUEST,
                'Tipe file tidak valid',
              ),
            );
          }
        }
        next();
      } catch (e) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        errorResponse(
          res,
          new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Gagal memproses file upload',
          ),
        );
      }
    }
  });
};

export const validateImagesArrayMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      for (const f of files) {
        if (!FileTypeUtils.isValidImage(f.path)) {
          // Clean up all uploaded files when invalid found
          for (const toDel of files) {
            if (toDel.path && fs.existsSync(toDel.path)) {
              try {
                fs.unlinkSync(toDel.path);
              } catch {}
            }
          }
          return errorResponse(
            res,
            new ResponseError(StatusCodes.BAD_REQUEST, 'Tipe file tidak valid'),
          );
        }
      }
    }
    next();
  } catch (e) {
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files) {
      for (const f of files) {
        if (f.path && fs.existsSync(f.path)) {
          try {
            fs.unlinkSync(f.path);
          } catch {}
        }
      }
    }
    errorResponse(
      res,
      new ResponseError(StatusCodes.BAD_REQUEST, 'Gagal memproses file upload'),
    );
  }
};
