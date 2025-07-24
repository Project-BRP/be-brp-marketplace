import { Router } from 'express';
import { ConfigController } from '../controllers';
import { uploadMiddleware } from '../middlewares';

export const configRoute: Router = Router();

configRoute.post('/logo', uploadMiddleware, ConfigController.uploadLogo);
configRoute.get('/logo', ConfigController.getLogo);
