"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Heart } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import { toast } from "sonner";

export default function Wishlist() {
  const { wishlist, remove, clear } = useWishlist();

  console.log("from wshlist", wishlist)

  const handleRemove = (id: string) => {
    remove(id);
    toast.error("Removed from wishlist 💔");
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Heart className="h-16 w-16 text-[#83B734] mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Save your favorite items and find them here later.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 rounded-lg bg-[#83B734] text-white font-medium hover:opacity-90 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Wishlist ({wishlist.length})
        </h1>
        <button
          onClick={() => {
            clear();
            toast.error("Wishlist cleared");
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* Image */}
            <Link href={`/products/${item.slug ?? ""}`}>
              <div className="relative h-52 bg-gray-50">
                <Image
                  src={item.image || "/api/placeholder/400/400"}
                  alt={item.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                {item.name}
              </h3>

              <p className="text-lg font-bold text-[#83B734] mb-4">
                ${item.price}
              </p>

              <div className="flex items-center justify-between">
                <Link
                  href={`/products/${item.slug ?? ""}`}
                  className="text-sm font-medium text-[#83B734] hover:underline"
                >
                  View Product
                </Link>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-full hover:bg-red-50 transition"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
