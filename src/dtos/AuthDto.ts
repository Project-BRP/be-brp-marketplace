import type { Request } from 'express';

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface IRegisterResponse {
  userId: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}

export interface IGetUserRequest {
  userId: string;
}

export interface IGetUserResponse {
  userId: string;
  email: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetAllUserRequest {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IGetAllUserResponse {
  totalPage: number;
  currentPage: number;
  users: IGetUserResponse[];
}

export interface IUpdateUserRequest {
  userId: string;
  email?: string;
  username?: string;
  password?: string;
  oldPassword?: string;
}

export interface IUpdateUserResponse {
  userId: string;
  username?: string;
  email?: string;
}

export interface IDeleteUserRequest {
  userId: string;
}

export interface ITokenPayload {
  userId: string;
}

export interface IForgotTokenPayload {
  email: string;
}

export interface IAuthDTO extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface ICheckResetTokenRequest {
  token: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
