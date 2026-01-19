"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const WishlistButton = ({ product }: { product: any }) => {
    const { toggle, isInWishlist } = useWishlist();


  const liked = isInWishlist(product.id);

    const handleWishlist = () => {
    toggle(product);

    if (liked) {
      toast.error("Removed from wishlist 💔");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
     <button onClick={handleWishlist}>
      <Heart
        className={`h-5 w-5 transition ${
          liked ? "text-red-500 fill-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
