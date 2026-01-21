export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  productImages: { imageUrl: string }[]
  stock?: number
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => Promise<void>; // ✅ quantity included
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCartFromDB: React.Dispatch<React.SetStateAction<CartItem[]>>;
}



export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: string
  image: string
}

export type WishlistContextType = {
  wishlist: WishlistItem[];
  count: number;
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clear: () => void;
};