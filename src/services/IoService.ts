import { Role } from '../constants';
import { io } from '../index';

export class IoService {
  static async emitNewTransaction(): Promise<void> {
    io.emit('newTransaction');
  }

  static async emitTransaction(): Promise<void> {
    io.emit('transactions');
  }

  static async emitChatMessage(roomId: string, userId: string): Promise<void> {
    io.to(`user:${userId}`).emit('chat:message', { roomId });
  }

  static isUserOnline(userId: string): boolean {
    try {
      const room = io.sockets.adapter.rooms.get(`user:${userId}`);
      return !!(room && room.size > 0);
    } catch {
      return false;
    }
  }

  static isAnyAdminOnline(): boolean {
    try {
      for (const [, socket] of io.sockets.sockets) {
        const data: any = (socket as any).data;
        if (data?.user?.role === Role.ADMIN) return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  static getOnlineUserIds(): string[] {
    try {
      const online = new Set<string>();
      for (const [, socket] of io.sockets.sockets) {
        const data: any = (socket as any).data;
        const u = data?.user;
        if (u?.userId && u?.role !== Role.ADMIN) {
          online.add(u.userId);
        }
      }
      return Array.from(online);
    } catch {
      return [];
    }
  }
}
