// components/products/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AddToCart } from '@/components/SharedComponent/AddToCart';
import { useState } from 'react';

interface ProductCardProps {
  product: any;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isSpinner, setIsSpinner] = useState(false);

  const mainImage = product.productImages?.[0]?.imageUrl || '/api/placeholder/400/400';
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || 0;
  const isInStock = product.stock > 0;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async () => {
    setIsSpinner(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSpinner(false);
  };

  console.log("from product card ", product)

  return (
    <div className={cn(
      "group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden",
      viewMode === 'list' && "flex",
      !isInStock && "opacity-75"
    )}>
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden bg-gray-100",
        viewMode === 'grid' ? "h-56" : "w-64 h-64"
      )}>
        <Link href={`/products/${product.id}`}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <span className="bg-primary text-white px-2 py-1 rounded text-xs font-bold shadow-md">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
              Featured
            </span>
          )}
          {!isInStock && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-shadow">
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:shadow-md transition-shadow">
            <Eye className="h-5 w-5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {/* Category Tag */}
        {product.category && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "p-4 flex-1",
        viewMode === 'list' && "flex flex-col justify-between"
      )}>
        <div>
          {/* Category & Stock */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">
              {product.category?.name}
            </span>
            <div className="flex items-center gap-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isInStock ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-xs text-gray-500">
                {isInStock ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isInStock ? `${product.stock} items left` : 'Restocking soon'}
            </p>
          </div>

          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              productImages: product.productImages,
              stock: product.stock,
            }}
            onclick={handleAddToCart}
            isSpinner={isSpinner}
          />

        </div>
      </div>
    </div>
  );
}