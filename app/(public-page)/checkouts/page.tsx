// app/checkout/page.tsx
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
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

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
    country: 'United States',
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderNotes, setOrderNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // Shipping Options
  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: 'Next business day' },
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

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep === 'cart') {
      router.push('/cart');
    }
  }, [cartItems, currentStep, router]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedShipping.price;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
    if (paymentMethod === 'credit-card') {
      return cardInfo.cardNumber && cardInfo.cardName && cardInfo.expiryDate && cardInfo.cvv;
    }
    return true; // Other payment methods might have different validation
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newOrderId = 'ORD-' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);
      setOrderComplete(true);
      setIsProcessing(false);
      clearCart();
      
      toast.success('Order placed successfully!', {
        description: `Your order #${newOrderId} has been confirmed.`
      });
    }, 2000);
  };

  // Steps configuration
  const steps = [
    { id: 'cart', name: 'Cart', icon: ShoppingBag },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'review', name: 'Review', icon: CheckCircle },
  ];

  // If order is complete
  if (orderComplete) {
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
                      {paymentMethod === 'credit-card' ? 'Credit Card' : 
                       paymentMethod === 'paypal' ? 'PayPal' : 
                       'Cash on Delivery'}
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
              
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Order Processing</h4>
                    <p className="text-sm text-gray-600">We're preparing your order</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Shipping</h4>
                    <p className="text-sm text-gray-600">Your order is on the way</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Home className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Delivery</h4>
                    <p className="text-sm text-gray-600">Your order arrives</p>
                  </div>
                </div>
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
                    <Label htmlFor="state">State *</Label>
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
                  
                  {!billingSameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Billing First Name</Label>
                        <Input
                          value={billingInfo.firstName}
                          onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Billing Last Name</Label>
                        <Input
                          value={billingInfo.lastName}
                          onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Billing Address</Label>
                        <Input
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Billing City</Label>
                        <Input
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Billing State</Label>
                        <Input
                          value={billingInfo.state}
                          onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Billing ZIP Code</Label>
                        <Input
                          value={billingInfo.zipCode}
                          onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
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
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Credit / Debit Card</span>
                          <div className="flex items-center gap-2">
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">Amex</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">PayPal</span>
                          <span className="text-xs text-gray-600">Secured by PayPal</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Cash on Delivery</span>
                          <span className="text-xs text-gray-600">Pay when you receive</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                          if (value.length <= 16) {
                            setCardInfo({...cardInfo, cardNumber: formatted});
                          }
                        }}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1"
                        maxLength={19}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        value={cardInfo.cardName}
                        onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const formatted = value.length > 2 
                              ? value.slice(0,2) + '/' + value.slice(2,4)
                              : value;
                            if (value.length <= 4) {
                              setCardInfo({...cardInfo, expiryDate: formatted});
                            }
                          }}
                          placeholder="MM/YY"
                          className="mt-1"
                          maxLength={5}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={cardInfo.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 3) {
                              setCardInfo({...cardInfo, cvv: value});
                            }
                          }}
                          placeholder="123"
                          className="mt-1"
                          maxLength={3}
                        />
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
                      {paymentMethod === 'credit-card' ? 'Credit Card' : 
                       paymentMethod === 'paypal' ? 'PayPal' : 
                       'Cash on Delivery'}
                    </p>
                    {paymentMethod === 'credit-card' && (
                      <p className="text-gray-600">
                        Card ending in {cardInfo.cardNumber.slice(-4)}
                      </p>
                    )}
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
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
                      <span className="text-gray-600">Estimated Tax</span>
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
                      <p className="text-sm text-gray-500">USD</p>
                    </div>
                  </div>

                  {/* Save Message */}
                  {total > 100 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 You saved on shipping! Orders over $100 ship free.
                      </p>
                    </div>
                  )}
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