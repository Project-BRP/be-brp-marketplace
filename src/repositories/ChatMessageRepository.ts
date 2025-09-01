import type { Prisma } from '@prisma/client';
import { ChatSenderType } from '@prisma/client';
import { db } from '../configs/database';

export class ChatMessageRepository {
  static async create(
    data: Prisma.ChatMessageCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.chatMessage.create({
      data,
      include: {
        attachments: true,
      },
    });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.chatMessage.findUnique({
      where: { id },
      include: { attachments: true },
    });
  }

  static async markReadByAdmin(
    roomId: string,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.chatMessage.updateMany({
      where: {
        roomId,
        isReadByAdmin: false,
        senderType: ChatSenderType.USER,
      },
      data: { isReadByAdmin: true },
    });
  }

  static async markReadByUser(
    roomId: string,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.chatMessage.updateMany({
      where: {
        roomId,
        isReadByUser: false,
        senderType: ChatSenderType.ADMIN,
      },
      data: { isReadByUser: true },
    });
  }
}
