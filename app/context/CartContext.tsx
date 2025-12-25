"use client"

import React, { createContext, useEffect, useState } from "react"
import { CartContextType, CartItem } from "@/types/productType"

export const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "cartItems"

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  /* Load cart once */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setCartItems(JSON.parse(stored))
    } catch (e) {
      console.error("Cart load failed", e)
    } finally {
      setHydrated(true)
    }
  }, [])

  /* Save cart after hydration */
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems, hydrated])

  const addToCart = (product: Omit<CartItem, "quantity"> | CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...prev,
        {
          ...product,
          quantity: "quantity" in product ? product.quantity : 1,
        },
      ]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem(STORAGE_KEY)
  }

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
