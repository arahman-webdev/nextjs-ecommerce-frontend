'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Leaf,
  Minus,
  Plus,
  Loader2
} from 'lucide-react';
import { AddToCart } from '@/components/SharedComponent/AddToCart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductInfoSectionProps {
  product: any;
  reviews: any[];
  onAddToWishlist: () => void;
}

export default function ProductInfoSection({ product, reviews }: ProductInfoSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!product) return;
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to use wishlist');
        return;
      }

      setIsAddingToWishlist(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/wishlist/add`,
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        setIsInWishlist(true);
        toast.success('Added to wishlist ❤️');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setIsInWishlist(true);
        toast.info('Already in wishlist');
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const router = useRouter()



  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Title and Rating */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {renderRating(product.averageRating)}
            <button onClick={()=>{}} className="text-gray-600 text-sm cursor-pointer hover:underline hover:text-primary transition-all ease-in-out duration-300">
              ({product.reviewCount} reviews)
            </button>
          </div>
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <span className="text-sm font-medium text-green-600">
            {product.totalOrders} orders • {product.stock} in stock
          </span>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-3xl lg:text-4xl font-bold text-primary mb-1" style={{ color: '#83B734' }}>
          {formatPrice(product.price)}
        </p>
        {product.price > 299 && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.price + 89)}
            </span>
            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-semibold">
              Save {formatPrice(89)}
            </span>
          </div>
        )}
        <p className="text-gray-600 text-sm mt-2">
          Free shipping on orders over $199 • 30-day returns
        </p>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {product.description || 'Premium quality furniture designed for modern living. Expertly crafted with sustainable materials and attention to detail.'}
        </p>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <div className="flex items-center justify-between border overflow-hidden w-full flex-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-3 sm:p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus size={20} />
            </button>
            <div className="px-4 sm:px-6 text-lg sm:text-xl font-semibold text-center">
              {quantity}
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-3 sm:p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={quantity >= product.stock}
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="w-full sm:w-auto flex-2">
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                productImages: product.productImages,
                stock: product.stock
              }}
              quantity={quantity}
              className="rounded-none bg-primary/90 w-full p-6 sm:p-6.5"
            />
          </div>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
        >
          <div className={cn(
            "p-2 rounded-lg border transition-all duration-200 group-hover:border-primary/50",
            isInWishlist ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
          )}>
            {isAddingToWishlist ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" style={{ color: '#83B734' }} />
            ) : (
              <Heart
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isInWishlist
                    ? "fill-red-500 text-red-500"
                    : "group-hover:text-primary"
                )}
                style={!isInWishlist ? { color: '#83B734' } : {}}
              />
            )}
          </div>
          <span className="font-medium">
            {isAddingToWishlist ? 'Processing...' : isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          </span>
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: '#83B7341A' }}>
            <Truck className="h-5 w-5" style={{ color: '#83B734' }} />
          </div>
          <div>
            <p className="font-medium text-gray-900">Free Shipping</p>
            <p className="text-sm text-gray-600">Orders over $199</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: '#83B7341A' }}>
            <ShieldCheck className="h-5 w-5" style={{ color: '#83B734' }} />
          </div>
          <div>
            <p className="font-medium text-gray-900">2-Year Warranty</p>
            <p className="text-sm text-gray-600">Quality guaranteed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: '#83B7341A' }}>
            <RefreshCw className="h-5 w-5" style={{ color: '#83B734' }} />
          </div>
          <div>
            <p className="font-medium text-gray-900">Easy Returns</p>
            <p className="text-sm text-gray-600">30-day policy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: '#83B7341A' }}>
            <Leaf className="h-5 w-5" style={{ color: '#83B734' }} />
          </div>
          <div>
            <p className="font-medium text-gray-900">Eco-Friendly</p>
            <p className="text-sm text-gray-600">Sustainable materials</p>
          </div>
        </div>
      </div>

      {/* SKU & Category */}
      <div className="pt-6 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">SKU:</span> FUR-{product.id.slice(0, 8)}
          </div>
          <div>
            <span className="font-medium text-gray-900">Category:</span>{' '}
            {product.category?.name || 'Furniture'}
          </div>
          <div>
            <span className="font-medium text-gray-900">Material:</span> Premium Wood & Fabric
          </div>
          <div>
            <span className="font-medium text-gray-900">Weight:</span>{' '}
            {product.weight ? `${product.weight}kg` : '15kg'}
          </div>
        </div>
      </div>
    </div>
  );
}