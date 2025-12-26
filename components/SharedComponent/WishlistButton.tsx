"use client";

import { useWishlist } from "@/app/context/WishlistContext";

const WishlistButton = ({ productId }: { productId: string }) => {
  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlist
  } = useWishlist();

  const liked = isInWishlist(productId);

  return (
    <button
      onClick={() =>
        liked
          ? removeFromWishlist(productId)
          : addToWishlist(productId)
      }
    >
      {liked ? "💔 Remove" : "❤️ Add"}
    </button>
  );
};

export default WishlistButton;
