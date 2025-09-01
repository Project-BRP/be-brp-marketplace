import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories';
import { JwtToken, socketCookieExtractor } from '../utils';
import { ResponseError } from '../error/ResponseError';
import { Role } from '../constants';

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  let token: string | undefined | null;

  try {
    // 1) Coba ambil dari cookie
    token = socketCookieExtractor(socket.handshake);

    // 2) Jika tidak ada, coba dari Authorization header
    if (!token) {
      const authHeader = socket.handshake.headers['authorization'];
      if (typeof authHeader === 'string') {
        const parts = authHeader.split(' ');
        if (parts[0] === 'Bearer' && parts[1]) {
          token = parts[1];
        }
      }
    }

    // 3) Jika tidak ada juga, fallback ke handshake.auth
    if (!token) {
      const hsAuth = (socket.handshake as any).auth;
      if (hsAuth && typeof hsAuth.token === 'string') {
        token = hsAuth.token;
      }
    }

    if (!token) {
      return next(new ResponseError(401, 'Unauthorized!'));
    }

    const decoded = JwtToken.verifyToken(token);
    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      return next(new ResponseError(401, 'Unauthorized!'));
    }

    socket.data.user = {
      userId: user.id,
      role: user.role,
    };

    socket.join(`user:${user.id}`);

    if (user.role === Role.ADMIN) {
      socket.join('admins');
    }

    return next();
  } catch (error) {
    if (error instanceof ResponseError) {
      return next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      return next(new ResponseError(401, 'Unauthorized!'));
    }

    return next(new ResponseError(500, 'Internal Server Error!'));
  }
};
