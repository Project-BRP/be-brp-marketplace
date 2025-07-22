import { Router } from 'express';
import { ProductController } from '../controllers';
import { authMiddleware, roleMiddleware } from '../middlewares';
import { Role } from '../constants';

export const productRoute: Router = Router();

productRoute.post(
  '/',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductController.createProduct,
);
productRoute.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductController.updateProduct,
);
productRoute.get('/:id', ProductController.getProductById);
productRoute.get('/', ProductController.getAllProducts);
productRoute.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductController.deleteProduct,
);
