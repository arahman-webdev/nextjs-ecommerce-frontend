// app/context/CartContext.tsx
"use client"

import React, { createContext, useEffect, useState } from "react"
import { CartContextType, CartItem } from "@/types/productType"

export const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "ecommerce-cart-items"

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    console.log("🔄 CartProvider mounting...")
    setIsMounted(true)
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      console.log("📦 Loading from localStorage:", stored)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log("📦 Parsed cart items:", parsed)
        
        if (Array.isArray(parsed)) {
          setCartItems(parsed)
        }
      }
    } catch (error) {
      console.error("❌ Failed to load cart:", error)
    }
    
    return () => {
      console.log("🔄 CartProvider unmounting...")
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (!isMounted) return
    
    console.log("💾 Saving cart to localStorage:", cartItems)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error("❌ Failed to save cart:", error)
    }
  }, [cartItems, isMounted])

  const addToCart = (product: Omit<CartItem, "quantity"> | CartItem) => {
    console.log("➕ Adding to cart:", product)
    
    setCartItems(prev => {
      // Convert to CartItem if needed
      const cartProduct = "quantity" in product 
        ? product 
        : { ...product, quantity: 1 }
      
      const existingIndex = prev.findIndex(item => item.id === cartProduct.id)
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        }
        console.log("📝 Updated existing item:", updated)
        return updated
      }
      
      // Add new item
      const updated = [...prev, cartProduct]
      console.log("🆕 Added new item:", updated)
      return updated
    })
  }

  const removeFromCart = (id: string) => {
    console.log("🗑️ Removing from cart:", id)
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    console.log("🔢 Updating quantity:", id, delta)
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const clearCart = () => {
    console.log("🧹 Clearing cart")
    setCartItems([])
  }

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  console.log("🎯 CartContext value:", contextValue)

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider