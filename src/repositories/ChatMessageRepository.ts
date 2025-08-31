import type { Prisma } from '@prisma/client';
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
}
