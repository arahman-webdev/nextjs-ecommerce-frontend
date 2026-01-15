// app/favorites/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Package, 
  Trash2,
  ArrowRight,
  Loader2,
  Calendar,
  Eye
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AddToCart } from '@/components/SharedComponent/AddToCart';

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
    productImages: Array<{
      id: string;
      imageUrl: string;
      imageId: string;
      productId: string;
      createdAt: string;
    }>;
    user?: {
      name: string;
      profilePhoto: string | null;
    };
  };
}

export default function MyFavorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view favorites');
        router.push('/login?redirect=/favorites');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/my-wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Wishlist API Response:', response.status);

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.clear();
        router.push('/login');
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Invalid response from server');
      }

      const data = await response.json();
      console.log('Wishlist API Data:', data);
      
      if (data.success && data.data) {
        setFavorites(data.data);
      } else {
        setFavorites([]);
        if (data.message) {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove product from favorites
  const removeFromFavorites = async (productId: string) => {
    try {
      setRemovingId(productId);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to manage favorites');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      console.log('Remove from wishlist response:', data);
      
      if (response.ok && data.success) {
        toast.success('Removed from favorites');
        // Update local state
        setFavorites(prev => prev.filter(item => item.product.id !== productId));
      } else {
        toast.error(data.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Something went wrong');
    } finally {
      setRemovingId(null);
    }
  };

  // Navigate to product details
  const viewProductDetails = (productSlug: string) => {
    router.push(`/products/${productSlug}`);
  };

  // Add product to cart
  const addToCart = async (productId: string, productName: string) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to add to cart');
        router.push('/login');
        return;
      }

      // This is a simplified version - you might need to adjust based on your cart API
      toast.success(`${productName} added to cart!`);
      
     
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" 
                   style={{ color: '#83B734' }} />
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {favorites.length === 0 
                  ? 'No favorite products yet'
                  : `You have ${favorites.length} favorite product${favorites.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/products')}
              className="gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop More
            </Button>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start shopping and add your favorite products to see them here!
            </p>
            <Button
              onClick={() => router.push('/products')}
              className="gap-2"
              style={{ backgroundColor: '#83B734' }}
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow border hover:border-gray-300"
              >
                {/* Product Image */}
                <div className="relative h-56 w-full group">
                  {item.product.productImages && item.product.productImages.length > 0 ? (
                    <>
                      <Image
                        src={item.product.productImages[0].imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromFavorites(item.product.id)}
                    disabled={removingId === item.product.id}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all disabled:opacity-50 z-10"
                    title="Remove from wishlist"
                  >
                    {removingId === item.product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                    ) : (
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    )}
                  </button>

                  {/* Stock badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${item.product.stock > 0 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                      {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>

                  {/* Rating */}
                  {item.product.averageRating > 0 && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      {renderRating(item.product.averageRating)}
                      <span className="text-xs font-medium ml-1">
                        ({item.product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold" style={{ color: '#83B734' }}>
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  {/* Seller Info (if available) */}
                  {item.product.user && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        {item.product.user.profilePhoto ? (
                          <Image
                            src={item.product.user.profilePhoto}
                            alt={item.product.user.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-medium">
                            {item.product.user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span>Sold by {item.product.user.name}</span>
                    </div>
                  )}

                  {/* Added Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Added {formatDate(item.createdAt)}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t">
                  <div className="flex w-full gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => removeFromFavorites(item.product.id)}
                      disabled={removingId === item.product.id}
                    >
                      {removingId === item.product.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </>
                      )}
                    </Button>
                    <div className="flex flex-1 gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => viewProductDetails(item.product.slug)}
                        className="flex-1"
                        title="View Product"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => addToCart(item.product.id, item.product.name)}
                        disabled={item.product.stock <= 0}
                        style={{ backgroundColor: '#83B734' }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Stats and Actions */}
        {favorites.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: '#83B734' }}>
                        {favorites.length}
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: '#83B734' }}>
                        {formatPrice(favorites.reduce((sum, item) => sum + item.product.price, 0))}
                      </p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Available Products</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: '#83B734' }}>
                        {favorites.filter(item => item.product.stock > 0).length}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={fetchWishlist}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh Wishlist'
                )}
              </Button>
              
            
              
              <Button
                variant="outline"
                onClick={() => router.push('/products')}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}