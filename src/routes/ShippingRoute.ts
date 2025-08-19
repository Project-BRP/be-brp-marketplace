import { Router } from 'express';
import { ShippingController } from '../controllers';
import { authMiddleware } from '../middlewares';

export const shippingRoute: Router = Router();

shippingRoute.get(
  '/provinces',
  authMiddleware,
  ShippingController.getProvinces,
);
shippingRoute.get(
  '/provinces/:provinceId/cities',
  authMiddleware,
  ShippingController.getCities,
);
shippingRoute.get(
  '/provinces/:provinceId/cities/:cityId/districts',
  authMiddleware,
  ShippingController.getDistricts,
);
shippingRoute.get(
  '/provinces/:provinceId/cities/:cityId/districts/:districtId/sub-districts',
  authMiddleware,
  ShippingController.getSubDistricts,
);
shippingRoute.post('/check-cost', authMiddleware, ShippingController.checkCost);
