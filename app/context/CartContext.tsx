"use client"



import { CartContextType, Product } from "@/types/productType"
import React, { createContext, useEffect, useState } from "react"

export const CartContext = createContext<CartContextType | null>(null)

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("cartItems")
    if (stored) setCartItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Omit<Product, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  return (
    <CartContext.Provider
      value={{ addToCart, cartItems, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider