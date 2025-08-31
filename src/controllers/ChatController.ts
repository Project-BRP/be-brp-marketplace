import type { NextFunction, Response } from 'express';
import type { IAuthDTO } from '../dtos';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';

import { ChatService } from '../services/ChatService';
import { successResponse } from '../utils';
import { SharpUtils } from '../utils/sharp-utils';
import { AttachmentType, Role } from '../constants';

export class ChatController {
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

      const response = await ChatService.createMessage({
        currentUserId: req.user?.userId,
        currentUserRole: req.user?.role as Role,
        userId: req.query.userId as string,
        content: req.body.content,
        attachments: attachmentsMeta,
      });

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
