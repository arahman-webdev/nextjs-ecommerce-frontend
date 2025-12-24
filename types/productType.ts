

export interface ProductImages {
  id?: string,
  imageUrl: string
}



export interface Product {
  id: number
  name: string
  slug: string
  category: string
  price: number
  description: string
  rating?: number
  quantity: number
  productImages: ProductImages[]
}

export interface ProductsResponse {
  success: boolean
  data: Product[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  page: number
  limit: number
  searchTerm?: string
  category?: string
  sortBy?: string
  orderBy?: string
}

export type CartContextType = {
  cartItems: Product[]
  addToCart: (product: Omit<Product, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, delta: number) => void
 
}



 