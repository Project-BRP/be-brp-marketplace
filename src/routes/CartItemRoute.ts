import { Router } from "express";
import { CartItemController } from "../controllers";
import { authMiddleware } from "../middlewares";

export const cartItemRoute: Router = Router();

cartItemRoute.post("/", authMiddleware, CartItemController.addToCart);
cartItemRoute.put("/:cartItemId", authMiddleware, CartItemController.updateCartItem);
cartItemRoute.delete("/:cartItemId", authMiddleware, CartItemController.removeCartItem);
