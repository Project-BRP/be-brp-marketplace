import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { ChatSenderType } from '@prisma/client';

import type {
  ICreateChatMessageRequest,
  ICreateChatMessageResponse,
} from '../dtos/ChatDto';
import { ResponseError } from '../error/ResponseError';
import { db as database } from '../configs/database';
import {
  ChatAttachmentRepository,
  ChatMessageRepository,
  ChatRoomRepository,
  UserRepository,
} from '../repositories';
import { Validator } from '../utils/validator';
import { ChatValidation } from '../validations/ChatValidation';
import { AttachmentType, Role } from '../constants';
import { TimeUtils } from 'utils';
import { IoService } from './IoService';

export class ChatService {
  static async createMessage(
    request: ICreateChatMessageRequest,
  ): Promise<ICreateChatMessageResponse> {
    const db = database;

    const validData = Validator.validate(ChatValidation.CREATE_MESSAGE, {
      userId: request.userId,
      content: request.content,
    });

    const senderId = request.currentUserId;
    const senderRole = request.currentUserRole;

    const targetUserId =
      senderRole === Role.ADMIN ? request.userId : request.currentUserId;
    if (!targetUserId) {
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        'User ID tujuan wajib diisi untuk admin',
      );
    }

    const targetUser = await UserRepository.findById(targetUserId);
    if (!targetUser) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'User tujuan tidak ditemukan',
      );
    }

    const now = TimeUtils.now();

    const created = await db.$transaction(async tx => {
      let room = await ChatRoomRepository.findByUserId(targetUserId, tx);
      if (!room) {
        room = await ChatRoomRepository.create(
          {
            id: 'CHR-' + uuid(),
            user: { connect: { id: targetUserId } },
            lastMessageAt: now,
          },
          tx,
        );
      }

      const hasAttachments = (request.attachments || []).length > 0;
      if (
        !hasAttachments &&
        (!request.content || request.content.trim().length === 0)
      ) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Konten pesan atau lampiran harus ada',
        );
      }

      const message = await ChatMessageRepository.create(
        {
          id: 'CHM-' + uuid(),
          room: { connect: { id: room.id } },
          sender: { connect: { id: senderId } },
          senderType:
            senderRole === 'ADMIN' ? ChatSenderType.ADMIN : ChatSenderType.USER,
          content: request.content?.trim() || null,
          hasAttachments,
          isReadByUser: senderRole === 'ADMIN' ? false : true,
          isReadByAdmin: senderRole === 'ADMIN' ? true : false,
        },
        tx,
      );

      if (hasAttachments) {
        await ChatAttachmentRepository.createMany(
          (request.attachments || []).map(att => ({
            id: 'CHA-' + uuid(),
            messageId: message.id,
            type: att.type,
            url: att.url,
            mimeType: att.mimeType,
            sizeBytes: att.sizeBytes,
            width: att.width ?? null,
            height: att.height ?? null,
          })),
          tx,
        );
      }

      await ChatRoomRepository.update(
        room.id,
        {
          lastMessageAt: now,
        },
        tx,
      );

      const fullMessage = await ChatMessageRepository.findById(message.id, tx);

      return { room, message: fullMessage! };
    });

    IoService.emitChatMessage(created.room.id);

    return {
      roomId: created.room.id,
      message: {
        id: created.message.id,
        roomId: created.message.roomId,
        senderId: created.message.senderId,
        senderType: created.message.senderType,
        content: created.message.content,
        hasAttachments: created.message.hasAttachments,
        isReadByUser: created.message.isReadByUser,
        isReadByAdmin: created.message.isReadByAdmin,
        createdAt: created.message.createdAt,
        updatedAt: created.message.updatedAt,
        attachments: (created.message.attachments || []).map(att => ({
          id: att.id,
          url: att.url,
          mimeType: att.mimeType,
          type: att.type as AttachmentType,
          sizeBytes: att.sizeBytes,
          width: att.width ?? undefined,
          height: att.height ?? undefined,
          createdAt: att.createdAt,
          updatedAt: att.updatedAt,
        })),
      },
    };
  }
}
