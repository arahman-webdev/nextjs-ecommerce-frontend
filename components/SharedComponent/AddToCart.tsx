// components/SharedComponent/AddToCart.tsx
"use client"

import { useState, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import { CartContext } from "@/app/context/CartContext"
import { Spinner } from "./Spinner"
import { Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react"

interface AddToCartProps {
  product?: {
    id: string
    name: string
    price: number
    productImages: { imageUrl: string }[]
  };
  onclick?: () => Promise<void> | void
}

export function AddToCart({ 
  product, 
  onclick
}: AddToCartProps) {
  const cartContext = useContext(CartContext)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false) // Local loading state
  const [justAdded, setJustAdded] = useState<string | null>(null) // Track recently added

  console.log("🔘 AddToCart component rendered")
  console.log("🔘 Cart context exists:", !!cartContext)
  console.log("🔘 Product data:", product)

  // Handle add to cart
  const handleAddToCart = async () => {
    console.log("🖱️ === ADD TO CART CLICKED ===")
    
    if (!cartContext) {
      console.error("❌ Cart context is null!")
      return
    }
    
    if (!product) {
      console.error("❌ No product to add!")
      return
    }

    console.log("📦 Product to add:", product)
    console.log("📦 Cart before adding:", cartContext.cartItems)

    // Show loading state
    setAddingToCart(true)
    setJustAdded(product.id) // Mark this product as just added

    try {
      // Create the cart item
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        productImages: product.productImages || []
      }
      
      console.log("📦 Cart item to add:", cartItem)
      
      // Call addToCart
      cartContext.addToCart(cartItem)
      
      console.log("✅ addToCart called successfully")
      
      // Wait for 500ms to show spinner properly
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Stop loading and open sidebar
      setAddingToCart(false)
      setIsOpen(true)
      
      // Check cart
      console.log("📦 Cart after adding:", cartContext.cartItems)
      
      // Reset justAdded after 1 second
      setTimeout(() => {
        setJustAdded(null)
      }, 1000)
      
    } catch (error) {
      console.error("❌ Error adding to cart:", error)
      setAddingToCart(false)
      setJustAdded(null)
    }
  }

  // Handle quantity change
  const handleQuantityChange = async (id: string, delta: number) => {
    if (!cartContext) return
    
    console.log(`🔢 Changing quantity for ${id}: ${delta}`)
    setIsUpdating(id)
    await new Promise(resolve => setTimeout(resolve, 300))
    cartContext.updateQuantity(id, delta)
    setIsUpdating(null)
  }

  // Handle remove item
  const handleRemove = async (id: string) => {
    if (!cartContext) return
    
    console.log(`🗑️ Removing item: ${id}`)
    setIsUpdating(id)
    await new Promise(resolve => setTimeout(resolve, 300))
    cartContext.removeFromCart(id)
    setIsUpdating(null)
  }

  // Calculate total
  const totalPrice = cartContext?.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  console.log("🛒 Current cart items:", cartContext?.cartItems || [])
  console.log("⏱️ Adding to cart:", addingToCart)

  // Show loading if no cart context
  if (!cartContext) {
    return (
      <Button size="sm" disabled className="bg-gray-300 text-gray-600">
        <Spinner className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <>
      {/* Add to Cart Button */}
      <Button 
        onClick={handleAddToCart}
        disabled={addingToCart || !product}
        size="sm"
        className={cn(
          "text-white min-w-[120px] transition-all duration-300",
          addingToCart 
            ? "bg-primary/80 cursor-wait" 
            : "bg-primary hover:bg-primary/90"
        )}
      >
        {addingToCart ? (
          <>
            <Spinner className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      {/* Cart Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-primary">
              Shopping Cart ({cartContext.cartItems.length} items)
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-auto py-6">
            {cartContext.cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <p className="text-sm text-gray-400 mb-2">Click "Add to Cart" to add items</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartContext.cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-4 p-4 border rounded-lg bg-white transition-all duration-300",
                     
                    )}
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        src={item.productImages?.[0]?.imageUrl || '/api/placeholder/80/80'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {isUpdating === item.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <Spinner className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      {justAdded === item.id && !isUpdating && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                          ✓
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                        {justAdded === item.id && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full animate-pulse">
                            Just added!
                          </span>
                        )}
                      </h3>
                      <p className="text-primary font-bold mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={isUpdating === item.id || item.quantity <= 1}
                            className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          
                          <span className="px-3 py-1 border rounded font-medium min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={isUpdating === item.id}
                            className="p-2 rounded border hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isUpdating === item.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
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

          {/* Cart Footer */}
          {cartContext.cartItems.length > 0 && (
            <SheetFooter className="flex flex-col gap-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
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
              
              <p className="text-xs text-center text-gray-500 pt-4 border-t">
                Free shipping on orders over $50
              </p>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

// Add cn utility function if not already imported
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}