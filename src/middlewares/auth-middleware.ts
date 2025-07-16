import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { appLogger } from '../configs/logger';
import type { IAuthDTO } from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { ActiveTokenRepository, UserRepository } from '../repositories';
import { errorResponse, JwtToken } from '../utils';
import { cookieExtractor } from '../utils/cookie-extractor';

export const authMiddleware = async (
  req: IAuthDTO,
  res: Response,
  next: NextFunction,
) => {
  /**bisa dipilih salah satu, cookie atau header, misal menggunakan cookie
   * maka ubah if statement menjadi const token = cookieExtractor(req) saja*/

  let token;

  if (cookieExtractor(req)) {
    token = cookieExtractor(req);
  } else {
    const authheader = req.headers.authorization;

    if (!authheader) {
      appLogger.error('No Token Provided!');

      return errorResponse(res, new ResponseError(401, 'Unauthorized!'));
    }

    token = authheader.split(' ')[1];
  }

  const activeToken = await ActiveTokenRepository.get();

  if (activeToken !== token) {
    appLogger.error('Invalid Token!');

    return errorResponse(res, new ResponseError(401, 'Unauthorized!'));
  }

  if (!token) {
    appLogger.error('No Token Provided!');

    return errorResponse(res, new ResponseError(401, 'Unauthorized!'));
  }

  try {
    const decoded = JwtToken.verifyToken(token);

    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      appLogger.error('User not found!');

      return errorResponse(res, new ResponseError(401, 'Unauthorized!'));
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof ResponseError) {
      return errorResponse(res, error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      appLogger.error('Invalid Token!');

      return errorResponse(res, new ResponseError(401, 'Unauthorized!'));
    }

    return errorResponse(res, new ResponseError(500, 'Internal Server Error!'));
  }
};
