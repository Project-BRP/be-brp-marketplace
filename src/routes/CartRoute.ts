import { Router } from 'express';
import { CartController } from '../controllers';
import { authMiddleware } from '../middlewares';

export const cartRoute: Router = Router();

cartRoute.get('/', authMiddleware, CartController.getCart);
