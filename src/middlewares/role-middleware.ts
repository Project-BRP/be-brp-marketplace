import type { Response, NextFunction } from 'express';

import type { IAuthDTO } from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { errorResponse } from '../utils';

export const roleMiddleware =
  (allowedRoles: string[]) =>
  (req: IAuthDTO, res: Response, next: NextFunction): void => {
    const { role } = req.user!;

    if (!allowedRoles.includes(role)) {
      return errorResponse(res, new ResponseError(403, 'Forbidden!'));
    }

    next();
  };
