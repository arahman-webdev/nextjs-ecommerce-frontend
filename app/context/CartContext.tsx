"use client";

import React, { createContext, useEffect, useState } from "react";
import { CartContextType, CartItem } from "@/types/productType";

export const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "ecommerce-cart-items";

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /* ---------------- Load cart (guest only) ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      } catch {
        console.error("Invalid cart data in localStorage");
      }
    }
  }, []);

  /* ---------------- Save cart (guest only) ---------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /* ---------------- Cart actions ---------------- */
  const addToCart = (product: Omit<CartItem, "quantity"> | CartItem) => {
    setCartItems(prev => {
      const item =
        "quantity" in product ? product : { ...product, quantity: 1 };

      const exists = prev.find(p => p.id === item.id);

      if (exists) {
        return prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* ---------------- 🔥 IMPORTANT ----------------
     Used AFTER login to hydrate cart from DB
  ------------------------------------------------ */
  const setCartFromDB = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.removeItem(STORAGE_KEY); // guest cart no longer needed
  };

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const fetchCartFromDB = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      console.log("Cart API Response:", data); // Debug log
      
      if (data?.data?.items) {
        console.log("First cart item with product:", data.data.items[0]); // Debug log
        console.log("Product images:", data.data.items[0]?.product?.productImages); // Debug log
        
        setCartFromDB(
          data.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            productImages: item.product.productImages || []
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load cart from DB on init", error);
    }
  };

  fetchCartFromDB();
}, []);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartFromDB, // ✅ THIS IS THE KEY
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
