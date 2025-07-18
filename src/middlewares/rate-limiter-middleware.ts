/* eslint-disable */
import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

import { Env } from '../constants';
import { ResponseError } from '../error/ResponseError';

export class RateLimiter {
  private static getLimiter(options: any) {
    if (
      process.env.NODE_ENV === Env.DEVELOPMENT ||
      process.env.NODE_ENV === Env.TESTING
    ) {
      return (req: Request, res: Response, next: NextFunction) => next();
    }

    return rateLimit(options);
  }

  static readonly registerLimiter = RateLimiter.getLimiter({
    windowMs: 60 * 1000,
    max: 1,
    handler: (req: Request, res: Response) => {
      throw new ResponseError(
        StatusCodes.TOO_MANY_REQUESTS,
        'Terlalu banyak permintaan, silakan coba lagi nanti',
      );
    },
  });

  static readonly verifyEmailLimiter = RateLimiter.getLimiter({
    windowMs: 60 * 1000,
    max: 1,
    handler: (req: Request, res: Response) => {
      throw new ResponseError(
        StatusCodes.TOO_MANY_REQUESTS,
        'Terlalu banyak permintaan, silakan coba lagi nanti',
      );
    },
  });

  static readonly loginLimiter = RateLimiter.getLimiter({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req: Request, res: Response) => {
      throw new ResponseError(
        StatusCodes.TOO_MANY_REQUESTS,
        'Terlalu banyak permintaan, silakan coba lagi nanti',
      );
    },
  });

  static readonly forgotPasswordLimiter = RateLimiter.getLimiter({
    windowMs: 60 * 1000,
    max: 1,
    handler: (req: Request, res: Response) => {
      throw new ResponseError(
        StatusCodes.TOO_MANY_REQUESTS,
        'Terlalu banyak permintaan, silakan coba lagi nanti',
      );
    },
  });

  static readonly resetPasswordLimiter = RateLimiter.getLimiter({
    windowMs: 60 * 1000,
    max: 1,
    handler: (req: Request, res: Response) => {
      throw new ResponseError(
        StatusCodes.TOO_MANY_REQUESTS,
        'Terlalu banyak permintaan, silakan coba lagi nanti',
      );
    },
  });
}
