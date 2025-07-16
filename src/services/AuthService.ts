import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import path from 'path';

import { CLIENT_URL, JWT_CONFIG, SMPTP_CONSTANTS } from '../constants';
import type {
  IRegisterRequest,
  IRegisterResponse,
  ILoginRequest,
  ILoginResponse,
  IGetUserRequest,
  IGetUserResponse,
  IGetAllUserRequest,
  IGetAllUserResponse,
  IUpdateUserRequest,
  IUpdateUserResponse,
  IDeleteUserRequest,
  IForgotPasswordRequest,
  ICheckResetTokenRequest,
  IResetPasswordRequest,
  IEmailDto,
} from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { SendToKafka } from '../kafka';
import { UserRepository, ResetTokenRepository } from '../repositories';
import { JwtToken, PasswordUtils, Validator } from '../utils';
import { AuthValidation } from '../validations';

export class AuthService {
  static async register(request: IRegisterRequest): Promise<IRegisterResponse> {
    const validData = Validator.validate(AuthValidation.REGISTER, request);

    let user = await UserRepository.findByUsername(validData.username);

    if (user) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Username sudah ada');
    }

    user = await UserRepository.findByEmail(validData.email);

    if (user) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Email sudah ada');
    }

    const hashedPassword = await PasswordUtils.hashPassword(validData.password);

    const newUser = await UserRepository.create({
      username: validData.username,
      email: validData.email,
      password: hashedPassword,
    });

    return {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  static async login(request: ILoginRequest): Promise<ILoginResponse> {
    const validData = Validator.validate(AuthValidation.LOGIN, request);

    const user = await UserRepository.findByEmail(validData.email);

    if (!user) {
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        'Email atau password salah',
      );
    }

    const isValidPassword = await PasswordUtils.comparePassword(
      validData.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        'Email atau password salah',
      );
    }

    const payload = {
      userId: user.id,
    };

    const accessToken = JwtToken.generateAccessToken(payload);

    return {
      accessToken,
    };
  }

  static async getUser(request: IGetUserRequest): Promise<IGetUserResponse> {
    const user = await UserRepository.findById(request.userId);

    if (!user) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async getAll(
    request: IGetAllUserRequest,
  ): Promise<IGetAllUserResponse> {
    const validData = Validator.validate(AuthValidation.GET_ALL_USER, request);

    const take = validData.limit;
    const skip = (validData.page - 1) * take;
    const search = validData.search;

    if (!take || !validData.page) {
      const users = await UserRepository.findAll(search);

      return {
        totalPage: 1,
        currentPage: 1,
        users: users.map((user: any) => ({
          userId: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      };
    }

    const totalUsers = await UserRepository.count(search);

    if (totalUsers === 0) {
      return {
        totalPage: 1,
        currentPage: 1,
        users: [],
      };
    }

    if (skip >= totalUsers) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, 'Halaman tidak valid');
    }

    const users = await UserRepository.findAllWithPagination(
      skip,
      take,
      search,
    );

    const totalPage = Math.ceil(totalUsers / take);

    const currentPage = Math.ceil(skip / take) + 1;

    return {
      totalPage,
      currentPage,
      users: users.map((user: any) => ({
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };
  }

  static async updateUser(
    request: IUpdateUserRequest,
  ): Promise<IUpdateUserResponse> {
    const validData = Validator.validate(AuthValidation.UPDATE, request);

    const user = await UserRepository.findById(request.userId);

    if (!user) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    const updateData: { username?: string; email?: string; password?: string } =
      {};

    if (validData.username) {
      const existingUser = await UserRepository.findByUsername(
        validData.username,
      );

      if (existingUser) {
        if (existingUser.id === request.userId) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Username tidak boleh sama',
          );
        }

        throw new ResponseError(StatusCodes.BAD_REQUEST, 'Username sudah ada');
      }

      updateData.username = validData.username;
    }

    if (validData.email) {
      const existingUser = await UserRepository.findByEmail(validData.email);

      if (existingUser) {
        if (existingUser.id === request.userId) {
          throw new ResponseError(
            StatusCodes.BAD_REQUEST,
            'Email tidak boleh sama',
          );
        }

        throw new ResponseError(StatusCodes.BAD_REQUEST, 'Email sudah ada');
      }

      updateData.email = validData.email;
    }

    if (validData.password) {
      const isValidPassword = await PasswordUtils.comparePassword(
        validData.oldPassword,
        user.password,
      );

      if (!isValidPassword) {
        throw new ResponseError(
          StatusCodes.UNAUTHORIZED,
          'Password lama salah',
        );
      }

      const hashedPassword = await PasswordUtils.hashPassword(
        validData.password,
      );

      updateData.password = hashedPassword;
    }

    const updatedUser = await UserRepository.update(request.userId, updateData);

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    };
  }

  static async deleteUser(request: IDeleteUserRequest): Promise<void> {
    const user = await UserRepository.findById(request.userId);

    if (!user) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    await UserRepository.delete(request.userId);
  }

  static async forgotPassword(request: IForgotPasswordRequest): Promise<void> {
    const validData = Validator.validate(
      AuthValidation.FORGOT_PASSWORD,
      request,
    );

    const user = await UserRepository.findByEmail(validData.email);

    if (!user) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    const payload = {
      email: user.email,
    };

    const token = JwtToken.generateForgotPasswordToken(payload);

    const resetLink = `${CLIENT_URL.PRODUCTION}/forget-password/${token}`;

    const templatePath = path.join(
      __dirname,
      '../utils/reset-password-template.html',
    );

    let emailHtml = fs.readFileSync(templatePath, 'utf-8');

    emailHtml = emailHtml.replace('{{reset_link}}', resetLink);

    const emailData: IEmailDto = {
      from: SMPTP_CONSTANTS.SMTP_EMAIL,
      to: user.email,
      subject: 'Reset Password',
      html: emailHtml,
    };

    await SendToKafka.sendEmailMessage(emailData);

    await ResetTokenRepository.set(
      user.id,
      token,
      JWT_CONFIG.JWT_FORGOT_PASSWORD_EXPIRES_IN,
    );
  }

  static async checkResetToken(
    request: ICheckResetTokenRequest,
  ): Promise<void> {
    const validData = Validator.validate(
      AuthValidation.CHECK_RESET_TOKEN,
      request,
    );

    const token = validData.token;

    try {
      const decoded = JwtToken.verifyForgotPasswordToken(token);

      const user = await UserRepository.findByEmail(decoded.email);

      if (!user) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
      }

      const validResetToken = await ResetTokenRepository.get(user.id);

      if (validResetToken !== token) {
        throw new ResponseError(StatusCodes.UNAUTHORIZED, 'Unauthorized!');
      }
    } catch (error) {
      if (error instanceof ResponseError) {
        throw error;
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ResponseError(StatusCodes.UNAUTHORIZED, 'Unauthorized!');
      }

      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
  }

  static async resetPassword(request: IResetPasswordRequest): Promise<void> {
    const validData = Validator.validate(
      AuthValidation.RESET_PASSWORD,
      request,
    );

    const token = validData.token;

    try {
      const decoded = JwtToken.verifyForgotPasswordToken(token);

      const user = await UserRepository.findByEmail(decoded.email);

      if (!user) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
      }

      const validResetToken = await ResetTokenRepository.get(user.id);

      if (validResetToken !== token) {
        throw new ResponseError(StatusCodes.UNAUTHORIZED, 'Unauthorized!');
      }

      const hashedPassword = await PasswordUtils.hashPassword(
        validData.password,
      );

      await UserRepository.update(user.id, {
        password: hashedPassword,
      });

      await ResetTokenRepository.delete(user.id);
    } catch (error) {
      if (error instanceof ResponseError) {
        throw error;
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ResponseError(StatusCodes.UNAUTHORIZED, 'Unauthorized!');
      }

      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
  }
}
