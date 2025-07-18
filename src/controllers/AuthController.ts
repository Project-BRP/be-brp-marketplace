import type { Request, Response, NextFunction } from 'express';

import { JWT_CONFIG } from '../constants';
import type {
  IRegisterRequest,
  IVerifyEmailRequest,
  ILoginRequest,
  IGetUserRequest,
  IGetAllUserRequest,
  IUpdateUserRequest,
  IDeleteUserRequest,
  IAuthDTO,
  IForgotPasswordRequest,
  ICheckResetTokenRequest,
  IResetPasswordRequest,
} from '../dtos';
import { AuthService } from '../services';
import { successResponse } from '../utils/api-response';

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as IRegisterRequest;
      const response = await AuthService.register(request);

      successResponse(res, 201, 'Email verifikasi berhasil dikirim', response);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        token: req.params.token,
      } as IVerifyEmailRequest;
      const response = await AuthService.verifyEmail(request);

      // jika menggunakan cookie, koneksi backend harus https
      res.cookie('token', response.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: JWT_CONFIG.JWT_EXPIRES_IN,
      });

      // jika memutuskan menggunakan header, hapus set cookie diatas
      successResponse(res, 200, 'Verifikasi email berhasil', response);
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ILoginRequest;
      const response = await AuthService.login(request);

      // jika menggunakan cookie, koneksi backend harus https
      res.cookie('token', response.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: JWT_CONFIG.JWT_EXPIRES_IN,
      });

      // jika memutuskan menggunakan header, hapus set cookie diatas
      successResponse(res, 200, 'Login Sukses', response);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        userId: req.user.userId,
      } as IGetUserRequest;
      const response = await AuthService.getUser(request);

      successResponse(res, 200, 'Berhasil mendapatkan user', response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        search: req.query.search ? (req.query.search as string) : null,
        page: req.query.page ? parseInt(req.query.page as string, 10) : null,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : null,
      } as IGetAllUserRequest;
      const response = await AuthService.getAll(request);

      successResponse(res, 200, 'Berhasil mendapatkan semua user', response);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        userId: req.user.userId,
        ...req.body,
      } as IUpdateUserRequest;
      const response = await AuthService.updateUser(request);

      successResponse(res, 200, 'Berhasil mengupdate user', response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = {
        userId: req.user.userId,
      } as IDeleteUserRequest;
      await AuthService.deleteUser(request);

      successResponse(res, 200, 'Berhasil menghapus user');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as IForgotPasswordRequest;
      await AuthService.forgotPassword(request);

      successResponse(res, 200, 'Berhasil mengirim email reset password');
    } catch (error) {
      next(error);
    }
  }

  static async checkResetToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as ICheckResetTokenRequest;
      await AuthService.checkResetToken(request);

      successResponse(res, 200, 'OK');
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = req.body as IResetPasswordRequest;
      await AuthService.resetPassword(request);

      successResponse(res, 200, 'Berhasil mereset password');
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      /**
       *  Jika memilih untuk menggunakan cookie gunakan metode dibawah.
       *  Jika memilih menggunakan header, maka gunakan pendekatan blacklist token atau cukup menghapus token di sisi client
       */
      res.clearCookie('token');
      successResponse(res, 200, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
}
