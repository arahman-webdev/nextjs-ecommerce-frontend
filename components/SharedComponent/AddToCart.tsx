// components/SharedComponent/AddToCart.tsx
"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import { CartContextType } from "@/types/productType"
import { CartContext } from "@/app/context/CartContext"
import { Spinner } from "./Spinner"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"

interface AddToCartProps {
  product?: any;
  onclick?: () => Promise<void> | void
  isSpinner?: boolean
}

export function AddToCart({ 
  product, 
  onclick, 
  isSpinner = false 
}: AddToCartProps) {
  const { cartItems, removeFromCart, updateQuantity, addToCart } = useContext(CartContext) as CartContextType
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = async () => {
    if (onclick) {
      await onclick()
    } else if (product) {
      // Add product to cart directly
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        productImages: product.productImages || []
      })
    }
    setIsOpen(true) 
  }

const handleQuantityChange = async (id: string, delta: number) => {
  setIsUpdating(id)
  await new Promise(res => setTimeout(res, 300))
  updateQuantity(id, delta)
  setIsUpdating(null)
}

const handleRemove = async (id: string) => {
  setIsUpdating(id)
  await new Promise(res => setTimeout(res, 300))
  removeFromCart(id)
  setIsUpdating(null)
}

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  return (
    <>
      {/* 🛒 Add to Cart Button */}
      <Button 
        onClick={handleClick} 
        disabled={isSpinner}
        size="sm"
        className="bg-primary hover:bg-primary/90"
      >
        {isSpinner ? (
          <>
            <Spinner className="h-4 w-4 mr-2" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      {/* 🧾 Cart Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-primary">
              Shopping Cart
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto py-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border rounded-lg bg-white"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        src={item?.productImages?.[0]?.imageUrl || '/api/placeholder/80/80'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {isUpdating === item.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <Spinner className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold mt-1">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={isUpdating === item.id || item.quantity <= 1}
                            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="px-3 py-1.5 border border-gray-300 rounded-md min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={isUpdating === item.id}
                            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isUpdating === item.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right mt-2">
                        <span className="text-sm text-gray-600">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <SheetFooter className="flex flex-col gap-4">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Shipping & taxes calculated at checkout</span>
                </div>

                <div className="flex flex-col gap-3">
                  <Link 
                    href="/cart" 
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      View Cart
                    </Button>
                  </Link>
                  
                  <Link 
                    href="/checkout" 
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Checkout Now
                    </Button>
                  </Link>
                </div>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                Free shipping on orders over $50
              </p>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}