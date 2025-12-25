'use client';

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Shield, 
  Lock, 
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Package,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');



  // Form States
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('ssl_commerz'); // Changed default to ssl_commerz
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNotes, setOrderNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // Shipping Options for Bangladesh
  const shippingOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 60, days: '5-7 business days' },
    { id: 'express', name: 'Express Delivery', price: 120, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Delivery', price: 250, days: 'Next business day' },
  ];

  const selectedShipping = shippingOptions.find(opt => opt.id === shippingMethod) || shippingOptions[0];

  if (!cartContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Loading checkout...</h2>
        </div>
      </div>
    );
  }

  const { cartItems, clearCart } = cartContext;



  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping.price;
  const tax = subtotal * 0.05; // 5% VAT for Bangladesh
  const total = subtotal + shippingCost + tax;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Handle next step
  const handleNextStep = () => {
    switch (currentStep) {
      case 'cart':
        setCurrentStep('shipping');
        break;
      case 'shipping':
        if (validateShippingInfo()) {
          setCurrentStep('payment');
        } else {
          toast.error('Please fill all required shipping information');
        }
        break;
      case 'payment':
        if (validatePaymentInfo()) {
          setCurrentStep('review');
        } else {
          toast.error('Please fill all required payment information');
        }
        break;
      case 'review':
        handlePlaceOrder();
        break;
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    switch (currentStep) {
      case 'shipping':
        setCurrentStep('cart');
        break;
      case 'payment':
        setCurrentStep('shipping');
        break;
      case 'review':
        setCurrentStep('payment');
        break;
    }
  };

  // Validate shipping info
  const validateShippingInfo = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return requiredFields.every(field => shippingInfo[field as keyof typeof shippingInfo].trim() !== '');
  };

  // Validate payment info
  const validatePaymentInfo = () => {
    // SSL Commerz doesn't require card info upfront
    return true;
  };

  // Get user ID from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Decode JWT token to get user ID (if you're using JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  
// Handle place order
const handlePlaceOrder = async () => {
  if (!acceptTerms) {
    toast.error('Please accept the terms and conditions');
    return;
  }

  setIsProcessing(true);

  try {
    // Get user ID and token
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login again');
      router.push('/login');
      return;
    }

    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    // Prepare order data matching your backend schema
    const orderData = {
      shippingAddressId: null, // You'll need to create address first or send address data
      billingAddressId: null,
      shippingMethod: shippingMethod.toUpperCase(), // 'STANDARD', 'EXPRESS', 'OVERNIGHT'
      paymentMethod: paymentMethod === 'ssl_commerz' ? 'SSL_COMMERZ' : 'CASH_ON_DELIVERY',
      customerNotes: orderNotes,
      // Cart items will be automatically taken from user's cart
    };

    console.log('Sending order data:', orderData);
    console.log('Token:', token.substring(0, 20) + '...');

    // Call your backend API - FIXED URL
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/payment/create-order`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    console.log('Backend response:', response.data);

    if (response.data.success) {
      const { order, payment } = response.data.data;
      
      setOrderId(order.id);
      setOrderComplete(true);
      
      // If payment URL is returned, redirect to payment page
      if (payment?.paymentUrl) {
        setPaymentUrl(payment.paymentUrl);
        // Show message before redirecting
        toast.success('Redirecting to payment gateway...');
        // Small delay to show toast
        setTimeout(() => {
          window.location.href = payment.paymentUrl;
        }, 1000);
      } else {
        // For Cash on Delivery
        toast.success('Order placed successfully!', {
          description: `Your order #${order.orderNumber} has been confirmed.`
        });
        clearCart();
      }
    } else {
      toast.error(response.data.message || 'Failed to create order');
    }

  } catch (error: any) {
    console.error('Order creation failed:', error);
    
    // Detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      
      toast.error('Failed to place order', {
        description: error.response.data?.message || 
                    error.response.data?.error || 
                    `Status: ${error.response.status}`
      });
    } else if (error.request) {
      console.error('Error request:', error.request);
      toast.error('Network error', {
        description: 'Cannot connect to server. Please check your connection.'
      });
    } else {
      toast.error('Error', {
        description: error.message || 'Something went wrong'
      });
    }
  } finally {
    setIsProcessing(false);
  }
};

  // Steps configuration
  const steps = [
    { id: 'cart', name: 'Cart', icon: ShoppingBag },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'review', name: 'Review', icon: CheckCircle },
  ];

  // If order is complete and waiting for payment
  if (orderComplete && paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-16 w-16 text-blue-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Redirecting to Payment
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              Please wait while we redirect you to the secure payment gateway.
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">SSL Commerz</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-500">Redirecting to secure payment...</p>
              
              <div className="mt-4">
                <Button 
                  onClick={() => window.location.href = paymentUrl}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Click here if not redirected
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If order is complete (for COD)
  if (orderComplete && !paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Order Confirmed!
              </h1>
              
              <p className="text-gray-600 text-lg mb-2">
                Thank you for your purchase
              </p>
              
              <p className="text-primary font-bold text-xl mb-8">
                Order #{orderId}
              </p>
              
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium text-gray-900">
                      {new Date(Date.now() + (selectedShipping.id === 'overnight' ? 86400000 : selectedShipping.id === 'express' ? 259200000 : 604800000)).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">
                      {paymentMethod === 'ssl_commerz' ? 'SSL Commerz' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orders">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                    <Package className="h-5 w-5 mr-2" />
                    View Order Details
                  </Button>
                </Link>
                
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0 && currentStep === 'cart') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-600 mt-2 mb-6">Add items to your cart to checkout</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xl">ShopCart</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    currentStep === step.id 
                      ? "bg-primary text-white" 
                      : index < steps.findIndex(s => s.id === currentStep)
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  )}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    currentStep === step.id 
                      ? "text-primary" 
                      : index < steps.findIndex(s => s.id === currentStep)
                      ? "text-green-600"
                      : "text-gray-400"
                  )}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:w-2/3">
            {/* Progress Steps - Mobile */}
            <div className="md:hidden mb-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 'cart'}
                  className="flex items-center gap-2 text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                
                <div className="text-center">
                  <span className="text-sm text-gray-500">Step</span>
                  <div className="font-bold text-primary">
                    {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
                  </div>
                </div>
                
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 text-primary font-medium"
                >
                  {currentStep === 'review' ? 'Place Order' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="h-2 bg-gray-200 rounded-full mt-4">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(steps.findIndex(s => s.id === currentStep) + 1) / steps.length * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Cart Review Step */}
            {currentStep === 'cart' && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Cart</h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                        <img 
                          src={item.productImages?.[0]?.imageUrl || '/api/placeholder/80/80'} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-primary font-bold">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                          <div className="font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Link href="/cart">
                    <Button variant="outline" className="w-full border-primary text-primary">
                      Edit Cart
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Shipping Information Step */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                    <Input
                      id="apartment"
                      value={shippingInfo.apartment}
                      onChange={(e) => setShippingInfo({...shippingInfo, apartment: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State/Division *</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="mt-1"
                      disabled
                    />
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Method</h3>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center justify-between p-4 border rounded-lg cursor-pointer",
                          shippingMethod === option.id && "border-primary bg-primary/5"
                        )}
                        onClick={() => setShippingMethod(option.id)}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div>
                            <Label htmlFor={option.id} className="font-medium text-gray-900 cursor-pointer">
                              {option.name}
                            </Label>
                            <p className="text-sm text-gray-600">{option.days}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(option.price)}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Order Notes */}
                <div className="mb-6">
                  <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                  <Textarea
                    id="orderNotes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="mt-1"
                    placeholder="Special instructions for your order..."
                    rows={3}
                  />
                </div>

                {/* Billing Address */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                      id="billingSame"
                      checked={billingSameAsShipping}
                      onCheckedChange={(checked) => setBillingSameAsShipping(checked as boolean)}
                    />
                    <Label htmlFor="billingSame" className="cursor-pointer">
                      Billing address is the same as shipping address
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information Step */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Information
                </h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <RadioGroupItem value="ssl_commerz" id="ssl_commerz" />
                      <Label htmlFor="ssl_commerz" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">SSL Commerz (Online Payment)</span>
                          <div className="flex items-center gap-2">
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Mobile Banking</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Secure payment with SSL Commerz gateway
                        </p>
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                      <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Cash on Delivery</span>
                          <span className="text-xs text-gray-600">Pay when you receive</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay with cash when your order is delivered
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* SSL Commerz Notice */}
                {paymentMethod === 'ssl_commerz' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Secure Payment Gateway</h4>
                        <p className="text-sm text-blue-700">
                          You will be redirected to SSL Commerz secure payment page. 
                          Your payment information is encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center justify-center gap-6 text-gray-600">
                    <div className="flex flex-col items-center">
                      <Lock className="h-8 w-8 mb-2" />
                      <span className="text-xs">256-bit SSL</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Shield className="h-8 w-8 mb-2" />
                      <span className="text-xs">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <span className="text-xs">PCI Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Order Step */}
            {currentStep === 'review' && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
                
                {/* Order Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded">
                            <img 
                              src={item.productImages?.[0]?.imageUrl || '/api/placeholder/48/48'} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p className="text-gray-600">{shippingInfo.address}</p>
                    <p className="text-gray-600">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p className="text-gray-600">{shippingInfo.country}</p>
                    <p className="text-gray-600 mt-2">📧 {shippingInfo.email}</p>
                    <p className="text-gray-600">📱 {shippingInfo.phone}</p>
                    <div className="mt-3 pt-3 border-t">
                      <p className="font-medium text-gray-900">Shipping Method: {selectedShipping.name}</p>
                      <p className="text-gray-600">Est. Delivery: {selectedShipping.days}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">
                      {paymentMethod === 'ssl_commerz' ? 'SSL Commerz Online Payment' : 'Cash on Delivery'}
                    </p>
                    <p className="text-gray-600">
                      {paymentMethod === 'ssl_commerz' 
                        ? 'You will be redirected to secure payment page' 
                        : 'Pay with cash when your order arrives'}
                    </p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="cursor-pointer text-sm">
                      I agree to the Terms & Conditions and Privacy Policy. I understand that my order is subject to availability and confirmation.
                    </Label>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="newsletter"
                      checked={subscribeNewsletter}
                      onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                    />
                    <Label htmlFor="newsletter" className="cursor-pointer text-sm">
                      Subscribe to our newsletter for exclusive offers and updates.
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-8">
              {currentStep !== 'cart' && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              
              <Button
                onClick={handleNextStep}
                disabled={isProcessing}
                className={cn(
                  "ml-auto bg-primary hover:bg-primary/90",
                  currentStep === 'review' && "px-8"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentStep === 'review' ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Place Order
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border mb-6">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{item.quantity} ×</span>
                          <span className="text-sm text-gray-900 line-clamp-1">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3 py-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatPrice(shippingCost)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT (5%)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(total)}
                      </div>
                      <p className="text-sm text-gray-500">BDT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">24/7 Support</p>
                      <p className="text-sm text-gray-600">We're here to help anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Money Back Guarantee</p>
                      <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-600">Your data is protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security */}
      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6" />
              <div>
                <p className="font-bold">Secure Checkout</p>
                <p className="text-sm text-gray-300">256-bit SSL encryption</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">PCI DSS Compliant</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">Money Back Guarantee</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">24/7 Customer Support</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} ShopCart. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}