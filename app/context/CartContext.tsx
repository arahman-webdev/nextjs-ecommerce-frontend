"use client";

import React, { createContext, useEffect, useState } from "react";
import { CartContextType, CartItem } from "@/types/productType";

export const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "ecommerce-cart-items";

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ---------------- Check login ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  /* ---------------- Guest cart only ---------------- */
  useEffect(() => {
    if (isLoggedIn) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCartItems(parsed);
      } catch {}
    }
  }, [isLoggedIn]);

  /* ---------------- Save guest cart ---------------- */
  useEffect(() => {
    if (isLoggedIn) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isLoggedIn]);

  /* ---------------- Load cart from DB ---------------- */
  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchCart = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data?.data?.items) {
        setCartItems(
          data.data.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            productImages: item.product.productImages || [],
          }))
        );
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  /* ---------------- Actions ---------------- */
  const addToCart = async (product: Omit<CartItem, "quantity">) => {
    if (!isLoggedIn) {
      // guest
      setCartItems(prev => {
        const exists = prev.find(p => p.id === product.id);
        if (exists) {
          return prev.map(p =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      return;
    }

    // logged in → DB
    const token = localStorage.getItem("accessToken");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/merge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 1 }],
      }),
    });

    // refresh DB cart
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    setCartItems(
      data.data.items.map((item: any) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        productImages: item.product.productImages || [],
      }))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart: id =>
          setCartItems(prev => prev.filter(i => i.id !== id)),
        updateQuantity: (id, delta) =>
          setCartItems(prev =>
            prev.map(i =>
              i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
            )
          ),
        clearCart: () => setCartItems([]),
        setCartFromDB: setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
