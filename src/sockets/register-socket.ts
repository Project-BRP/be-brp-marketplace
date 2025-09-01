import { Role } from '../constants';
import type { Server } from 'socket.io';

export function registerSocketHandlers(io: Server): void {
  io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    try {
      const data: any = (socket as any).data || {};
      const currentUser = data.user;
      if (currentUser?.role === Role.ADMIN) {
        io.emit('presence:admin', { isOnline: true });
      } else if (currentUser?.userId) {
        io.to('admins').emit('presence:user', {
          userId: currentUser.userId,
          isOnline: true,
        });
      }
    } catch {}

    socket.on('disconnect', () => {
      console.log('User  disconnected:', socket.id);
      try {
        const data: any = (socket as any).data || {};
        const currentUser = data.user;
        if (currentUser?.role === Role.ADMIN) {
          let anyAdminOnline = false;
          for (const [, s] of io.sockets.sockets) {
            const d: any = (s as any).data;
            if (d?.user?.role === Role.ADMIN) {
              anyAdminOnline = true;
              break;
            }
          }
          io.emit('presence:admin', { isOnline: anyAdminOnline });
        } else if (currentUser?.userId) {
          const room = io.sockets.adapter.rooms.get(
            `user:${currentUser.userId}`,
          );
          const stillOnline = !!(room && room.size > 0);
          if (!stillOnline) {
            io.to('admins').emit('presence:user', {
              userId: currentUser.userId,
              isOnline: false,
            });
          }
        }
      } catch {}
    });
  });
}
