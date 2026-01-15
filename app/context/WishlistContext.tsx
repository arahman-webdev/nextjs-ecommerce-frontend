"use client"
import { WishlistContextType, WishlistItem } from "@/types/productType";
import { createContext, useEffect, useState } from "react";

const WishlistContext = createContext<WishlistContextType | null>(null)

const STORAGE_KEY = "wishlist";

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  // load from local storage

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setWishlist(JSON.parse(stored))
    }
  }, [])


  // Save to localStorage (sync)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist]);

  const add = (item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.some(p => p.id === item.id)) return prev;
      return [...prev, item]
    })
  }

  const remove = (id:string) => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }

  const toggle = (item: WishlistItem) => {
    setWishlist(prev =>
      prev.some(p => p.id === item.id)
        ? prev.filter(p => p.id !== item.id)
        : [...prev, item]
    );
  };

  const isInWishlist = (id: string) =>
    wishlist.some(item => item.id === id);

  const clear = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider 
    value={{ wishlist,
        count: wishlist.length,
        add,
        remove,
        toggle,
        isInWishlist,
        clear,}}
    >
      {children}
    </WishlistContext.Provider>
  )

}