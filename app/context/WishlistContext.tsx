"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type WishlistItem = { productId: string };

type WishlistContextType = {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLoading: boolean
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const isInWishlist = (productId: string) =>
    wishlist.some(item => item.productId === productId);

  /* ---------------- Add ---------------- */
  const addToWishlist = async (productId: string) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to use wishlist");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        "https://ecommerce-backend-ten-dusky.vercel.app/api/product/wishlist/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!res.ok) throw new Error("Failed to add");

      setWishlist(prev =>
        prev.some(i => i.productId === productId)
          ? prev
          : [...prev, { productId }]
      );

      toast.success("Added to wishlist ❤️");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  /* ---------------- Remove ---------------- */
  const removeFromWishlist = async (productId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(
        `https://ecommerce-backend-ten-dusky.vercel.app/api/product/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlist(prev =>
        prev.filter(item => item.productId !== productId)
      );

      toast.success("Removed from wishlist");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  /* ---------------- Load on refresh ---------------- */
useEffect(() => {
  const token = getToken();
  if (!token) {
    setIsLoading(false);
    return;
  }

  fetch("https://ecommerce-backend-ten-dusky.vercel.app/api/product/my-wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => setWishlist(data.data ?? []))
    .finally(() => setIsLoading(false));
}, []);


  return (
    <WishlistContext.Provider
      value={{ wishlist,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
};
