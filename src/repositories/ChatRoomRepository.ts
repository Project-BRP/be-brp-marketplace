import type { Prisma } from '@prisma/client';
import { db } from '../configs/database';

export class ChatRoomRepository {
  static async findByUserId(userId: string, tx: Prisma.TransactionClient = db) {
    return tx.chatRoom.findFirst({ where: { userId } });
  }

  static async findById(id: string, tx: Prisma.TransactionClient = db) {
    return tx.chatRoom.findUnique({ where: { id } });
  }

  static async create(
    data: Prisma.ChatRoomCreateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.chatRoom.create({ data });
  }

  static async update(
    id: string,
    data: Prisma.ChatRoomUpdateInput,
    tx: Prisma.TransactionClient = db,
  ) {
    return tx.chatRoom.update({ where: { id }, data });
  }
}
