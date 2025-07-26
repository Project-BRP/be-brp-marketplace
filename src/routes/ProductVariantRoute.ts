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
  '/products/:productId',
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
productVariantRoute.patch(
  '/:id/add-stock',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductVariantController.addStock,
);
productVariantRoute.get('/:id', ProductVariantController.getProductVariantById);
productVariantRoute.get(
  '/products/:productId',
  ProductVariantController.getAllProductVariants,
);
productVariantRoute.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Role.ADMIN]),
  ProductVariantController.deleteProductVariant,
);
