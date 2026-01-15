'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CartContext } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingBag,
  Heart,
  Star,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Package,
  CheckCircle,
  MessageSquare,
  Users,
  ChevronRight,
  Minus,
  Plus,
  Loader2,
  Check,
  Maximize2,
  RotateCcw,
  Package2,
  Tag,
  Truck as TruckIcon,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  Leaf,
  Palette,
  Ruler,
  Weight,
  Factory,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';
import { AddToCart } from '@/components/SharedComponent/AddToCart';

interface ProductImage {
  id: string;
  imageUrl: string;
  imageId: string;
  productId: string;
  createdAt: string;
}

interface ProductVariant {
  id: string;
  color: string | null;
  size: string | null;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  userId: string;
  categoryId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  weight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
  productImages: ProductImage[];
  variants: ProductVariant[];
  category: {
    id: string;
    name: string;
    createdAt: string;
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const cartContext = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);



  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`
      );

      if (response.data.success) {
        const productData = response.data.data;

        setProduct(productData);

        // ✅ Use data directly, NOT state
        fetchReviews(productData.id);
        fetchRelatedProducts(productData.category?.name);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchReviews = async (productId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/review${productId}`
      );
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  const fetchRelatedProducts = async (categoryName?: string) => {
    if (!categoryName) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product?category=${encodeURIComponent(categoryName)}`
      );

      if (response.data.success) {
        setRelatedProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };


  console.log("from detail page with related products", product)

  const handleAddToWishlist = async () => {
    try {
      if (!product) return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to use wishlist');
        return;
      }



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
      } else {
        // toast.error(response.data.message || 'Failed to add to wishlist');

        console.log("from wishlist err", response.data.data)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.error('Wishlist error:', error.response.data.message);

      if (error.response?.status === 409) {
        // already exists
        setIsInWishlist(true);
        toast.info('Already in wishlist');
      } else {
        console.log("something went wrong")
      }
    } finally {
      setIsAddingToWishlist(false);
    }
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description || 'Check out this product!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!reviewComment.trim()) {
        toast.error('Please write a review');
        return;
      }

      if (!product?.id) {
        toast.error('No product selected');
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to submit a review');
        // You can add redirect to login here if needed
        return;
      }

      setSubmittingReview(true);

      const reviewData = {
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/review/${product.id}`,
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        toast.success('Review submitted successfully!');

        // Refresh reviews
        fetchReviews(product.id);

        // Reset form
        setReviewComment('');
        setReviewRating(5);
        setShowReviewForm(false);
      } else {
        throw new Error(response.data?.message || 'Failed to submit review');
      }

    } catch (error: any) {
      console.error('Review submission error:', error);

      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.clear();
        // Redirect to login if needed
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading product...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90" style={{ backgroundColor: '#83B734' }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log("from checing product", product?.category?.name)

  return (
    <div className="bg-gray-50">
      {/* Container with your provided max-width */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link> /{' '}
          <Link href="/furniture" className="hover:text-primary transition-colors">Furniture</Link> /{' '}
          <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* ========== LEFT: IMAGES ========== */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div
              className="relative bg-gray-50 rounded-2xl overflow-hidden group border"

            >
              <div className="relative h-full  w-full">
                <Image
                  src={product.productImages[selectedImageIndex]?.imageUrl}
                  alt={product.name}
                  width={600}
                  height={600}
                  className={cn(
                    "object-cover transition-transform duration-300",

                  )}


                />
              </div>

              {/* Zoom Indicator */}
              {isZoomed && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute w-64 h-64 border-2 border-primary/50 bg-white/20"
                    style={{
                      left: `calc(${zoomPosition.x}% - 128px)`,
                      top: `calc(${zoomPosition.y}% - 128px)`,
                    }}
                  />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <div className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg" style={{ backgroundColor: '#83B734' }}>
                    FEATURED
                  </div>
                )}
                {product.totalOrders > 50 && (
                  <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    POPULAR
                  </div>
                )}
                {product.averageRating >= 4.5 && (
                  <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    TOP RATED
                  </div>
                )}
              </div>

              {/* Image Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-full flex items-center justify-center"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-full flex items-center justify-center"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.productImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-xl overflow-hidden transition-all duration-200',
                    selectedImageIndex === i
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-gray-200'
                  )}
                  style={selectedImageIndex === i ? { borderColor: '#83B734' } : {}}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.imageUrl}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ========== RIGHT: INFO ========== */}
          <div className="space-y-6 lg:space-y-8">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderRating(product.averageRating)}
                  <span className="text-gray-600 text-sm">
                    ({product.reviewCount} reviews)
                  </span>
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
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-4 sm:px-6 text-lg sm:text-xl font-semibold min-w-[40px] sm:min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <AddToCart
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      productImages: product.productImages,
                    }}
                  />
                </div>
              </div>

              {/* Wishlist - Fixed styling */}
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
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 lg:mt-16">
          <Tabs defaultValue="description" className="w-full">
            <div className="border-b">
              <TabsList className="w-full bg-transparent h-12 lg:h-14 overflow-x-auto">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
                  style={{ borderColor: '#83B734' }}
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
                  style={{ borderColor: '#83B734' }}
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
                  style={{ borderColor: '#83B734' }}
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
                  style={{ borderColor: '#83B734' }}
                >
                  Shipping & Returns
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="py-6 lg:py-8">
              <TabsContent value="description" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        {product.description || 'Elevate your living space with this premium furniture piece. Expertly crafted with attention to detail, this item combines modern aesthetics with unparalleled comfort.'}
                      </p>
                      <p>
                        Designed for both style and functionality, this furniture piece features sustainable materials and superior craftsmanship that ensures lasting durability and timeless appeal.
                      </p>

                      <h4 className="text-lg lg:text-xl font-bold text-gray-900 mt-6 lg:mt-8 mb-4">Key Features:</h4>
                      <ul className="space-y-3">
                        {[
                          'Premium sustainable materials for eco-friendly living',
                          'Ergonomic design for optimal comfort and support',
                          'Easy assembly with included tools and instructions',
                          'Sturdy construction with weight capacity of 300lbs',
                          'Easy-to-clean and maintain surface',
                          'Versatile design complements any interior style'
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" style={{ color: '#83B734' }} />
                            <span className="text-sm lg:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0">
                    <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-6 lg:p-8">
                      <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Designer Notes</h4>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <Award className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">Award-Winning Design</h5>
                            <p className="text-gray-600 text-sm">Recognized for innovative design and sustainability</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Leaf className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">Eco-Friendly</h5>
                            <p className="text-gray-600 text-sm">Made with 100% sustainable and recycled materials</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <Factory className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">Ethical Manufacturing</h5>
                            <p className="text-gray-600 text-sm">Crafted in facilities with fair labor practices</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-0">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {[
                    { icon: Ruler, label: 'Dimensions', value: `${product.width || 24}" W × ${28}" D × ${product.height || 33}" H` },
                    { icon: Weight, label: 'Weight', value: `${product.weight || 15} kg` },
                    { icon: Palette, label: 'Colors Available', value: '4 Colors' },
                    { icon: CheckSquare, label: 'Assembly Required', value: 'Yes (20-30 mins)' },
                    { icon: Shield, label: 'Warranty', value: '2 Years' },
                    { icon: Package2, label: 'Package Weight', value: '18 kg' },
                    { icon: Truck, label: 'Shipping Dimensions', value: '26" × 30" × 35"' },
                    { icon: RefreshCw, label: 'Return Period', value: '30 Days' },
                    { icon: Clock, label: 'Delivery Time', value: '3-5 Business Days' },
                  ].map((spec, index) => (
                    <div key={index} className="border rounded-lg lg:rounded-xl p-4 lg:p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2 lg:mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: '#83B7341A' }}>
                          <spec.icon className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#83B734' }} />
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{spec.label}</h4>
                      </div>
                      <p className="text-gray-700 text-sm lg:text-base">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  <div className="lg:w-1/3">
                    <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-6 lg:p-8">
                      <div className="text-center mb-6 lg:mb-8">
                        <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{product.averageRating.toFixed(1)}</div>
                        {renderRating(product.averageRating)}
                        <p className="text-gray-600 mt-3 text-sm lg:text-base">
                          Based on {reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                      </div>

                      <div className="space-y-3 lg:space-y-4">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = reviews.filter(r => Math.round(r.rating) === stars).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={stars} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 min-w-[60px] lg:min-w-[80px]">
                                <span className="text-sm text-gray-600">{stars}</span>
                                <Star className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: '#83B734'
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 min-w-[30px] lg:min-w-[40px]">{count}</span>
                            </div>
                          );
                        })}
                      </div>

                      <Button
                        className="w-full mt-6 lg:mt-8 h-10 lg:h-12"
                        style={{ backgroundColor: '#83B734' }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Write a Review
                      </Button>
                    </div>
                  </div>

                  <div className="lg:w-2/3 mt-6 lg:mt-0">
                    <div className="space-y-6 lg:space-y-8">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 lg:pb-8 last:border-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                              <div className="flex items-start gap-3 lg:gap-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                                  <Users className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                                    {renderRating(review.rating)}
                                    <span className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {review.rating >= 4 && (
                                <div className="flex items-center gap-1 text-sm font-medium text-primary" style={{ color: '#83B734' }}>
                                  <TrendingUp className="h-4 w-4" />
                                  Recommended
                                </div>
                              )}
                            </div>

                            {review.comment && (
                              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">{review.comment}</p>
                            )}

                            <div className="flex items-center gap-4 mt-4 lg:mt-6">
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                Helpful? 👍
                              </button>
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                Reply
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 lg:py-16">
                          <MessageSquare className="h-16 w-16 lg:h-20 lg:w-20 text-gray-300 mx-auto mb-4 lg:mb-6" />
                          <h4 className="text-xl lg:text-2xl font-bold text-gray-700 mb-2 lg:mb-3">No Reviews Yet</h4>
                          <p className="text-gray-600 max-w-md mx-auto mb-6 lg:mb-8 text-sm lg:text-base">
                            Be the first to share your experience with this product. Your review helps others make informed decisions.
                          </p>
                          <Button
                            className="px-6 lg:px-8 py-2 lg:py-3"
                            style={{ backgroundColor: '#83B734' }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Write the First Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Shipping Information</h3>
                    <div className="space-y-6">
                      <div className="border rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="p-2 lg:p-3 bg-primary/10 rounded-lg lg:rounded-xl flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                            <Truck className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Standard Shipping</h4>
                            <p className="text-gray-600">5-7 business days</p>
                          </div>
                          <div className="ml-0 sm:ml-auto">
                            <p className="text-lg lg:text-xl font-bold text-primary" style={{ color: '#83B734' }}>
                              {product.price > 199 ? 'FREE' : '$14.99'}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm lg:text-base">
                          Free standard shipping on all orders over $199. Orders placed before 2 PM EST ship same day.
                        </p>
                      </div>

                      <div className="border rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="p-2 lg:p-3 bg-primary/10 rounded-lg lg:rounded-xl flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                            <Clock className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Express Shipping</h4>
                            <p className="text-gray-600">2-3 business days</p>
                          </div>
                          <div className="ml-0 sm:ml-auto">
                            <p className="text-lg lg:text-xl font-bold text-gray-900">$24.99</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm lg:text-base">
                          Get your order faster with expedited shipping. Available for in-stock items only.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Return Policy</h3>
                    <div className="space-y-6">
                      <div className="border rounded-xl lg:rounded-2xl p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="p-2 lg:p-3 bg-primary/10 rounded-lg lg:rounded-xl flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                            <RefreshCw className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">30-Day Returns</h4>
                            <p className="text-gray-600">Hassle-free returns</p>
                          </div>
                        </div>
                        <div className="space-y-2 lg:space-y-3 text-gray-700 text-sm lg:text-base">
                          <p>• Return within 30 days of delivery for a full refund</p>
                          <p>• Item must be in original condition with all packaging</p>
                          <p>• Free returns for damaged or defective items</p>
                          <p>• Refunds processed within 3-5 business days</p>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-xl lg:rounded-2xl p-4 lg:p-6" style={{ backgroundColor: '#83B7340A', borderColor: '#83B73433' }}>
                        <div className="flex items-start gap-3 lg:gap-4">
                          <ShieldCheck className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Extended Warranty Available</h4>
                            <p className="text-gray-700 mb-3 text-sm lg:text-base">
                              Extend your warranty to 5 years for additional peace of mind.
                            </p>
                            <Button
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary/10 text-sm"
                              style={{ borderColor: '#83B734', color: '#83B734' }}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 lg:mt-20">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">You May Also Like</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
                Discover more premium furniture pieces that complement your style and elevate your space
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group bg-white rounded-xl lg:rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <Link href={`/products/${relatedProduct.slug}`} className="block">
                    <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                      {relatedProduct.productImages.length > 0 ? (
                        <Image
                          src={relatedProduct.productImages[0].imageUrl || '/api/placeholder/300/300'}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300" />
                        </div>
                      )}

                      {relatedProduct.isFeatured && (
                        <div className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-primary text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#83B734' }}>
                          NEW
                        </div>
                      )}
                    </div>

                    <div className="p-4 lg:p-5">
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <span className="text-xs lg:text-sm font-medium text-gray-600">
                          {relatedProduct.category?.name || 'Furniture'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs lg:text-sm text-gray-600">
                            {relatedProduct.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 lg:mb-3 text-sm lg:text-base group-hover:text-primary transition-colors" style={{ color: '#83B734' }}>
                        {relatedProduct.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-lg lg:text-xl font-bold text-gray-900">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <AddToCart
                          product={{
                            id: relatedProduct.id,
                            name: relatedProduct.name,
                            price: relatedProduct.price,
                            productImages: relatedProduct.productImages,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}