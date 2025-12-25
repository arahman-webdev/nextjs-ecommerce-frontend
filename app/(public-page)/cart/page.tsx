// app/cart/page.tsx
'use client';

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartContext } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Shield, 
  Truck, 
  RefreshCw,
  Heart,
  Package,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const cartContext = useContext(CartContext);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Mock shipping options
  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: 'Next business day' },
  ];

  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);

  if (!cartContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Loading cart...</h2>
        </div>
      </div>
    );
  }

  const { cartItems, updateQuantity, removeFromCart, clearCart } = cartContext;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping.price;
  const discount = appliedCoupon?.discount || 0;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = Math.max(0, subtotal + shippingCost + tax - discount);

  // Handle quantity update
  const handleQuantityChange = async (id: string, delta: number) => {
    setIsUpdating(id);
    await new Promise(resolve => setTimeout(resolve, 300));
    updateQuantity(id, delta);
    setIsUpdating(null);
  };

  // Handle remove item
  const handleRemoveItem = async (id: string) => {
    setIsUpdating(id);
    await new Promise(resolve => setTimeout(resolve, 300));
    removeFromCart(id);
    setIsUpdating(null);
  };

  // Handle apply coupon
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'welcome10') {
        setAppliedCoupon({ code: 'WELCOME10', discount: subtotal * 0.1 }); // 10% discount
      } else if (couponCode.toLowerCase() === 'save20') {
        setAppliedCoupon({ code: 'SAVE20', discount: 20 }); // $20 discount
      }
      setIsApplyingCoupon(false);
      setCouponCode('');
    }, 500);
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-primary" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              
              <Link href="/">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            {/* Trending products suggestion */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Trending Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                    <h3 className="font-semibold text-gray-900 mb-2">Featured Product {i}</h3>
                    <p className="text-primary font-bold mb-3">$99.99</p>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <Link href="/products">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                        <Image
                          src={item.productImages?.[0]?.imageUrl || '/api/placeholder/300/300'}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                        {isUpdating === item.id && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <RefreshCw className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link 
                              href={`/products/${item.id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(item.price)}
                              </span>
                              
                              {item.price > 50 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <Package className="h-3 w-3 mr-1" />
                                  Free Shipping Eligible
                                </span>
                              )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                (item.stock || 10) > 5 ? "bg-green-500" : "bg-amber-500"
                              )} />
                              <span className="text-sm text-gray-600">
                                {(item.stock || 10) > 5 
                                  ? 'In Stock' 
                                  : 'Only ' + (item.stock || 10) + ' left'
                                }
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={isUpdating === item.id || item.quantity <= 1}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <div className="w-12 text-center">
                                <span className="font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                              </div>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                disabled={isUpdating === item.id}
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdating === item.id}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-primary"
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              Move to Wishlist
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Item Total</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Options */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Shipping Options
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                        selectedShipping.id === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedShipping(option)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          selectedShipping.id === option.id
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        )}>
                          {selectedShipping.id === option.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{option.name}</h3>
                          <p className="text-sm text-gray-600">{option.days}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(option.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Coupon Code */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-gray-900">Have a coupon code?</h3>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                        disabled={!!appliedCoupon || isApplyingCoupon}
                      />
                      {appliedCoupon ? (
                        <Button
                          variant="outline"
                          onClick={handleRemoveCoupon}
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || isApplyingCoupon}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isApplyingCoupon ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            {appliedCoupon.code} applied
                          </span>
                        </div>
                        <span className="font-bold text-green-800">
                          -{formatPrice(appliedCoupon.discount)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatPrice(shippingCost)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Tax</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatPrice(appliedCoupon.discount)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(total)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {total > 50 ? 'Free shipping applied!' : `Add $${(50 - total).toFixed(2)} for free shipping`}
                      </p>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="pt-4">
                    <div className="flex items-center justify-center gap-6 text-gray-500">
                      <div className="flex flex-col items-center">
                        <Shield className="h-8 w-8 mb-1" />
                        <span className="text-xs">Secure Payment</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Lock className="h-8 w-8 mb-1" />
                        <span className="text-xs">SSL Encrypted</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <CreditCard className="h-8 w-8 mb-1" />
                        <span className="text-xs">Money Back</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary/90 mt-4 py-6 text-lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  {/* Continue Shopping */}
                  <Link href="/products">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-primary text-primary hover:bg-primary/10 mt-2"
                    >
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Help Text */}
                  <p className="text-center text-sm text-gray-500 pt-4">
                    Prices and shipping are calculated at checkout
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border">
                <h3 className="font-bold text-gray-900 mb-4">Why Shop With Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">30-Day Returns</p>
                      <p className="text-sm text-gray-600">Hassle-free returns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-600">100% secure transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed / Recommended */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900 mb-2">Recommended Product {i}</h3>
                <p className="text-primary font-bold mb-3">${(Math.random() * 100 + 20).toFixed(2)}</p>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}