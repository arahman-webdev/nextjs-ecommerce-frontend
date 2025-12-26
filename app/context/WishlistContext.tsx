"use client";

import { useRouter } from "next/router";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type WishlistItem = {
  productId: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

 
    // Check if exists
 
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  
    // Add to wishlist
 
  const addToWishlist = async (productId: string) => {
    if (!token) {
      toast.error("Please login to use wishlist");
      router.push('/login');
      return 
    }

    try {
      const res = await fetch(
        "https://ecommerce-backend-ten-dusky.vercel.app/api/product/wishlist/add",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add to wishlist");
      }

      setWishlist(prev => [...prev, { productId }]);
      toast.success("Added to wishlist ❤️");

    } catch (error: any) {
      toast.error(error.message);
    }
  };

 
  //   Remove from wishlist

  const removeFromWishlist = async (productId: string) => {
    if (!token) return;

    try {
      const res = await fetch(
        `https://ecommerce-backend-ten-dusky.vercel.app/api/product/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove wishlist");
      }

      setWishlist(prev =>
        prev.filter(item => item.productId !== productId)
      );

      toast.success("Removed from wishlist");

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/* -------------------------
   Custom hook
--------------------------*/
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
