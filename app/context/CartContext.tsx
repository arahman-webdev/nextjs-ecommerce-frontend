"use client"

import React, { createContext, useEffect, useState } from "react"
import { CartContextType, CartItem } from "@/types/productType"

export const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "ecommerce-cart-items"

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartReady, setCartReady] = useState(false)

  // ✅ Load cart ONCE
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCartItems(parsed)
        }
      }
    } catch (e) {
      console.error("Failed to load cart", e)
    } finally {
      setCartReady(true)
    }
  }, [])

  // ✅ Save cart
  useEffect(() => {
    if (!cartReady) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems, cartReady])

  const addToCart = (product: Omit<CartItem, "quantity"> | CartItem) => {
    setCartItems(prev => {
      const item = "quantity" in product ? product : { ...product, quantity: 1 }
      const index = prev.findIndex(p => p.id === item.id)

      if (index !== -1) {
        const updated = [...prev]
        updated[index].quantity += 1
        return updated
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) =>
    setCartItems(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id: string, delta: number) =>
    setCartItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    )

  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
