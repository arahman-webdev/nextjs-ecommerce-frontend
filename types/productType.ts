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
}
