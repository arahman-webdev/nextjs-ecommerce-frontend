

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

  /* ---------------- Guest cart load ---------------- */
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
    if (!isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  /* ---------------- Load cart from DB ---------------- */
  const fetchDBCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

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

  useEffect(() => {
    if (isLoggedIn) {
      fetchDBCart();
      localStorage.removeItem(STORAGE_KEY); // clear guest cart
    }
  }, [isLoggedIn]);

  /* ---------------- Add to cart ---------------- */
 const addToCart = async (product: CartItem) => {
  if (!isLoggedIn) {
    setCartItems(prev => {
      const exists = prev.find(p => p.id === product.id);

      if (exists) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p
        );
      }

      return [...prev, product]; // quantity already included
    });

    return;
  }


  // 🟢 LOGGED-IN USER → DB
  const token = localStorage.getItem("accessToken");

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/merge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ productId: product.id, quantity: product.quantity }],
    }),
  });

  // 🔄 refresh DB cart
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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


  /* ---------------- Update quantity ---------------- */
  const updateQuantity = async (id: string, delta: number) => {
    if (!isLoggedIn) {
      // guest
      setCartItems(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        )
      );
      return;
    }

    const token = localStorage.getItem("accessToken");
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/quantity`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
        quantity: item.quantity + delta,
      }),
    });

    await fetchDBCart();
  };

  /* ---------------- Remove from cart ---------------- */
  const removeFromCart = async (id: string) => {
    if (!isLoggedIn) {
      setCartItems(prev => prev.filter(i => i.id !== id));
      return;
    }

    const token = localStorage.getItem("accessToken");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await fetchDBCart();
  };


  const clearCart = async (productIds?: string[]) => {
  if (!isLoggedIn) {
    // 🟡 guest
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  // 🟢 logged in → DB
  const token = localStorage.getItem("accessToken");

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    
  });
  
  await fetchDBCart();
  

  setCartItems([]);
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCartFromDB: setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

