// components/layout/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  MessageSquare,
  ChevronRight,
  Globe,
  Heart,
  Sparkles,
  Award,
  Leaf,
  Zap,
  Store,
  Users,
  Package,
  ShoppingBag,
  Tag,
  HelpCircle,
  FileText,
  User,
  Settings,
  Lock,
  Star,
  TrendingUp,
  Smartphone,
  MailIcon,
  Send
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Footer data - customizable
  const footerData = {
    company: {
      name: 'ShopCart',
      description: 'Your one-stop destination for premium products and exceptional shopping experience.',
      logo: (
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Shop<span className="text-primary">Cart</span>
          </span>
        </Link>
      ),
      tagline: 'Redefining Online Shopping',
      features: [
        { icon: Shield, text: '100% Secure Payments', color: 'text-green-500' },
        { icon: Truck, text: 'Free Shipping Over $50', color: 'text-blue-500' },
        { icon: RefreshCw, text: 'Easy Returns', color: 'text-purple-500' },
        { icon: Award, text: 'Premium Quality', color: 'text-amber-500' }
      ]
    },
    
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Shop', href: '/products' },
      { name: 'Categories', href: '/categories' },
      { name: 'Best Sellers', href: '/products?sort=bestsellers' },
      { name: 'New Arrivals', href: '/products?sort=newest' },
      { name: 'Flash Sales', href: '/products?sort=flash' }
    ],

    categories: [
      { name: 'Electronics', href: '/category/electronics', count: 1245 },
      { name: 'Fashion', href: '/category/fashion', count: 892 },
      { name: 'Home & Living', href: '/category/home-living', count: 567 },
      { name: 'Beauty', href: '/category/beauty', count: 431 },
      { name: 'Sports', href: '/category/sports', count: 289 },
      { name: 'Books', href: '/category/books', count: 156 }
    ],

    customerService: [
      { name: 'My Account', href: '/account', icon: User },
      { name: 'Order Tracking', href: '/track-order', icon: Package },
      { name: 'Returns & Refunds', href: '/returns', icon: RefreshCw },
      { name: 'Shipping Info', href: '/shipping', icon: Truck },
      { name: 'FAQ', href: '/faq', icon: HelpCircle },
      { name: 'Contact Us', href: '/contact', icon: MessageSquare }
    ],

    companyInfo: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Privacy Policy', href: '/privacy' }
    ],

    contact: {
      email: 'mdarahman5645@gmail.com',
      phone: '+880 1719 617907',
      address: '5840 Sherpur, Bogra, Rajshahi',
      hours: 'Mon-Sat: 9AM - 8PM EST'
    },

    socialLinks: [
      { platform: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
      { platform: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
      { platform: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
      { platform: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
      { platform: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' }
    ],

    paymentMethods: [
      { name: 'Visa', color: '#1A1F71' },
      { name: 'Mastercard', color: '#EB001B' },
      { name: 'PayPal', color: '#003087' },
      { name: 'Apple Pay', color: '#000000' },
      { name: 'Google Pay', color: '#5F6368' },
      { name: 'Stripe', color: '#6772E5' }
    ]
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Add your newsletter subscription logic here
      console.log('Subscribing email:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Update current year on mount
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const primaryColor = '#83B734';

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-16">
      {/* Top Section - Newsletter & Features */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Newsletter Subscription */}
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-gray-900">
                  Stay Updated with ShopCart
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter and get 15% off your first order, plus exclusive offers and updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="h-12 px-8 rounded-lg gap-2 group"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubscribed ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-3">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Secure</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-8 w-8 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Free Shipping</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2">
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info & Logo */}
          <div className="lg:col-span-2 space-y-6">
            {footerData.company.logo}
            <p className="text-gray-600 leading-relaxed">
              ShopCart is your premier online destination for quality products, 
              exceptional service, and an unforgettable shopping experience.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Us</p>
                  <p className="font-semibold text-gray-900">{footerData.contact.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Us</p>
                  <p className="font-semibold text-gray-900">{footerData.contact.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit Us</p>
                  <p className="font-semibold text-gray-900">{footerData.contact.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Top Categories
            </h3>
            <ul className="space-y-3">
              {footerData.categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href}
                    className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs bg-gray-100">
                      {category.count}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer Service
            </h3>
            <ul className="space-y-3">
              {footerData.customerService.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.name}>
                    <Link 
                      href={service.href}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      {service.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Download App */}
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                Download Our App
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Shop on the go with our mobile app
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Image 
                    src="/app-store.svg" 
                    alt="App Store" 
                    width={16} 
                    height={16}
                    className="mr-2"
                  />
                  App Store
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Image 
                    src="/play-store.svg" 
                    alt="Play Store" 
                    width={16} 
                    height={16}
                    className="mr-2"
                  />
                  Play Store
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                {footerData.socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.platform}
                      href={social.href}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-white border border-gray-200",
                        "hover:shadow-md transition-all duration-300",
                        social.color
                      )}
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                We Accept
              </h4>
              <div className="flex items-center gap-2">
                {footerData.paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="w-12 h-8 rounded border border-gray-200 bg-white flex items-center justify-center"
                    title={method.name}
                  >
                    <span 
                      className="text-xs font-bold"
                      style={{ color: method.color }}
                    >
                      {method.name.substring(0, 2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">
                © {currentYear} ShopCart. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Designed with <Heart className="inline h-3 w-3 text-red-400" /> for amazing shopping experiences
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4">
              {footerData.companyInfo.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <select 
                className="bg-transparent text-sm text-gray-300 border-none focus:ring-0"
                aria-label="Select country"
              >
                <option value="US">Bangladesh</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/90 text-white p-3 shadow-lg transform translate-y-full hover:translate-y-0 transition-transform duration-300 group">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">
              🎉 Flash Sale! Up to 50% Off - Limited Time Offer
            </span>
          </div>
          <Link 
            href="/products?sort=flash" 
            className="flex items-center gap-2 text-sm font-medium bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Shop Now
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}