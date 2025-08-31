import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middlewares';
import { upload } from '../configs/multer';

export const chatRoute: Router = Router();

chatRoute.post(
  '/messages',
  authMiddleware,
  upload.array('attachments', 5),
  ChatController.createMessage,
);
