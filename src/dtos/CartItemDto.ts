export interface IAddToCartRequest {
  variantId: string;
  quantity: number;
}

export interface IAddToCartResponse {
  id: string;
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface IUpdateCartItemResponse {
  id: string;
  variantId: string;
  quantity: number;
  productVariant: {
    id: string;
    productId: string;
    weight_in_kg: number;
    packaging?: {
      id: string;
      name: string;
    };
    imageUrl: string;
    priceRupiah: number;
    stock: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IRemoveCartItemRequest {
  cartItemId: string;
}

export interface ICartItem {
  id: string;
  variantId: string;
  quantity: number;
  productVariant: {
    id: string;
    productId: string;
    weight_in_kg: number;
    packaging?: {
      id: string;
      name: string;
    };
    imageUrl: string;
    priceRupiah: number;
    stock: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
