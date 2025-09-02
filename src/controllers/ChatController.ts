import type { NextFunction, Response } from 'express';
import type {
  IAuthDTO,
  ICreateChatMessageRequest,
  IDeleteChatRoomRequest,
  IGetAllChatRoomsRequest,
  IGetChatRoomDetailByUserIdRequest,
  IGetChatRoomDetailRequest,
} from '../dtos';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';

import { ChatService } from '../services/ChatService';
import { successResponse, SharpUtils } from '../utils';
import { AttachmentType, Role } from '../constants';
import { IoService } from '../services/IoService';

export class ChatController {
  static async getAdminPresence(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const isOnline = IoService.isAnyAdminOnline();
      successResponse(res, StatusCodes.OK, 'Status admin', { isOnline });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminUnreadTotal(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await ChatService.getAdminUnreadTotal();
      successResponse(res, StatusCodes.OK, 'Total unread untuk admin', result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserUnreadTotal(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await ChatService.getUserUnreadTotal(req.user!.userId);
      successResponse(res, StatusCodes.OK, 'Total unread untuk user', result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserPresence(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const isOnline = IoService.isUserOnline(userId);
      successResponse(res, StatusCodes.OK, 'Status user', { userId, isOnline });
    } catch (error) {
      next(error);
    }
  }

  static async getOnlineUsers(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = IoService.getOnlineUsers();
      successResponse(res, StatusCodes.OK, 'Daftar user online', {
        count: users.length,
        users,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllRooms(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetAllChatRoomsRequest = {
        search: (req.query.search as string) || null,
        page: req.query.page ? parseInt(req.query.page as string, 10) : null,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : null,
      };

      const response = await ChatService.getAllRooms(request);

      successResponse(
        res,
        StatusCodes.OK,
        'Daftar chat room berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getRoomDetail(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetChatRoomDetailRequest = {
        currentUserId: req.user!.userId,
        currentUserRole: req.user!.role as Role,
        roomId: req.params.roomId,
      };

      const response = await ChatService.getRoomDetail(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Detail chat room berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async getRoomDetailByUserId(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IGetChatRoomDetailByUserIdRequest = {
        currentUserId: req.user!.userId,
        currentUserRole: req.user!.role as Role,
        userId: req.user!.userId,
      };

      const response = await ChatService.getRoomDetailByUserId(request);
      successResponse(
        res,
        StatusCodes.OK,
        'Detail chat room berhasil diambil',
        response,
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request: IDeleteChatRoomRequest = {
        roomId: req.params.roomId,
      };
      await ChatService.deleteRoom(request);
      successResponse(res, StatusCodes.OK, 'Chat room berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }

  static async createMessage(
    req: IAuthDTO,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const attachmentsMeta: {
      url: string;
      mimeType: string;
      sizeBytes: number;
      type: AttachmentType;
      width?: number | null;
      height?: number | null;
    }[] = [];
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;

      if (files && files.length > 0) {
        for (const f of files) {
          let saved;
          let attachmentType;

          if (f.mimetype.startsWith('image/')) {
            saved = await SharpUtils.saveChatImage(f.path);
            attachmentType = AttachmentType.IMAGE;
          } else if (f.mimetype.startsWith('video/')) {
            attachmentType = AttachmentType.VIDEO;
          } else {
            attachmentType = AttachmentType.FILE;
          }

          attachmentsMeta.push({
            url: saved.path,
            mimeType: f.mimetype,
            sizeBytes: f.size,
            width: saved.width,
            height: saved.height,
            type: attachmentType,
          });
        }
      }

      const request: ICreateChatMessageRequest = {
        currentUserId: req.user?.userId,
        currentUserRole: req.user?.role as Role,
        userId: req.query.userId as string,
        content: req.body.content,
        attachments: attachmentsMeta,
      };

      const response = await ChatService.createMessage(request);

      successResponse(
        res,
        StatusCodes.CREATED,
        'Pesan berhasil dikirim',
        response,
      );
    } catch (error) {
      if (attachmentsMeta.length > 0) {
        for (const att of attachmentsMeta) {
          if (att.url && fs.existsSync(att.url)) {
            try {
              await fs.unlinkSync(att.url);
            } catch (e) {
              console.error('Gagal menghapus attachment:', att.url, e);
            }
          }
        }
      }
      next(error);
    }
  }
}
