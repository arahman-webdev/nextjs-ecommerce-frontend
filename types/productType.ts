export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  productImages: { imageUrl: string }[]
  stock?: number
}

export interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
  setCartFromDB:any
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