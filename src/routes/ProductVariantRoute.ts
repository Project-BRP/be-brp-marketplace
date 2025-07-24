import { Router } from 'express';
import { ProductVariantController } from '../controllers/ProductVariantController'; // Sesuaikan path jika perlu
import {
  authMiddleware,
  roleMiddleware,
  uploadMiddleware,
} from '../middlewares';
import { Role } from '../constants';

export const productVariantRoute: Router = Router();

productVariantRoute.post(
  '/product/:productId',
  authMiddleware,
  uploadMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductVariantController.createProductVariant,
);
productVariantRoute.patch(
  '/:id',
  authMiddleware,
  uploadMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductVariantController.updateProductVariant,
);
productVariantRoute.get('/:id', ProductVariantController.getProductVariantById);
productVariantRoute.get(
  '/product/:productId',
  ProductVariantController.getAllProductVariants,
);
productVariantRoute.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductVariantController.deleteProductVariant,
);
