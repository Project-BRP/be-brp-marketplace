import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { ResponseError } from '../error/ResponseError';
import { appLogger } from '../configs/logger';

export const successResponse = (
  res: Response,
  code: number,
  message: string,
  data?: any,
): void => {
  if (data === undefined) {
    res.status(code).json({
      status: 'success',
      code: code,
      message: message,
    });
  } else {
    res.status(code).json({
      status: 'success',
      code: code,
      message: message,
      data: data,
    });
  }
};

export const errorResponse = (res: Response, error: Error): void => {
  if (error instanceof ResponseError) {
    res.status(error.status).json({
      status: 'error',
      code: error.status,
      message: error.message,
    });
  } else if (error instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      code: StatusCodes.BAD_REQUEST,
      message: error.errors[0].message,
    });
  } else {
    appLogger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
};
