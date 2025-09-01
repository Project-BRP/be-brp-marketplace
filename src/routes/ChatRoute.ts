import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middlewares';
import { upload } from '../configs/multer';
import { roleMiddleware } from '../middlewares';
import { Role } from '../constants';
import { validateImagesArrayMiddleware } from '../middlewares';

export const chatRoute: Router = Router();

// Presence endpoints
chatRoute.get(
  '/presence/admin',
  authMiddleware,
  ChatController.getAdminPresence,
);
chatRoute.get(
  '/presence/user/:userId',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ChatController.getUserPresence,
);
chatRoute.get(
  '/presence/users-online',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ChatController.getOnlineUsers,
);

chatRoute.get(
  '/rooms',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ChatController.getAllRooms,
);
chatRoute.get(
  '/rooms/user',
  authMiddleware,
  ChatController.getRoomDetailByUserId,
);
chatRoute.get('/rooms/:roomId', authMiddleware, ChatController.getRoomDetail);
chatRoute.delete(
  '/rooms/:roomId',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ChatController.deleteRoom,
);
chatRoute.post(
  '/messages',
  authMiddleware,
  upload.array('attachments', 5),
  validateImagesArrayMiddleware,
  ChatController.createMessage,
);
