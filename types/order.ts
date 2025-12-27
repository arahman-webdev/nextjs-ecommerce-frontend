// types/order.ts
export type OrderStatus = "PENDING" | "PROCESSING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export interface ProductImage {
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  productImages: ProductImage[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  product: Product;
}

export interface Payment {
  id: string;
  status: string;
  method: string;
  amount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  createdAt: string;
  estimatedDelivery: string | null;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  payment: Payment | null;
  shippingMethod: string;
  trackingNumber: string | null;
}