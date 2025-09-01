import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middlewares';
import { upload } from '../configs/multer';
import { roleMiddleware } from '../middlewares';
import { Role } from '../constants';

export const chatRoute: Router = Router();

chatRoute.get(
  '/rooms',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ChatController.getAllRooms,
);
chatRoute.get(
  '/rooms/:roomId',
  authMiddleware,
  ChatController.getRoomDetail,
);
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
  ChatController.createMessage,
);
