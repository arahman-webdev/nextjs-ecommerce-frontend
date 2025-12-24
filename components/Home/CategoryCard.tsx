// components/hero/ModernHero.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShoppingBag, Star, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Hero sections data
const heroSections = [
  {
    id: 1,
    title: "WATCH",
    subtitle: "ULTRA 2",
    tagline: "Next level adventure",
    description: "A magical new way to use your watch without touching the screen. The brightest Apple display ever.",
    image: "/api/placeholder/800/800", // Replace with your watch image
    imageAlt: "Smart Watch Ultra 2",
    buttonText: "Shop Now",
    buttonLink: "/products/smart-watch-ultra-2",
    bgColor: "bg-gradient-to-br from-gray-900 to-black",
    textColor: "text-white",
    accentColor: "text-cyan-400",
    badge: "New",
    badgeColor: "bg-cyan-500",
    features: ["Touch-Free Control", "Super Bright Display", "48hr Battery"],
  },
  {
    id: 2,
    title: "ROSS GARDAM",
    subtitle: "Hearth loft series",
    tagline: "Premium Comfort",
    description: "The expansive proportions of the seating's surface, combined with the soft, curved arms create the ideal environment for relaxation.",
    image: "/api/placeholder/800/800", // Replace with your furniture image
    imageAlt: "Premium Furniture",
    buttonText: "Shop Now",
    buttonLink: "/products/hearth-loft-series",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    textColor: "text-gray-900",
    accentColor: "text-amber-600",
    badge: "Best Seller",
    badgeColor: "bg-amber-500",
    features: ["Premium Materials", "Ergonomic Design", "Easy Assembly"],
  },
  {
    id: 3,
    title: "Hair Dryer",
    subtitle: "Blue Blush Edition",
    tagline: "Professional Performance",
    description: "Finished in Blue Blush, cushioned with soft fabric and with a removable lid that is also a non-slip mat for your hair dryer.",
    image: "/api/placeholder/800/800", // Replace with your hair dryer image
    imageAlt: "Hair Dryer Blue Blush",
    buttonText: "Shop Now",
    buttonLink: "/products/hair-dryer-blue-blush",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    textColor: "text-gray-900",
    accentColor: "text-blue-600",
    badge: "Limited Edition",
    badgeColor: "bg-blue-500",
    features: ["Quick Drying", "Low Noise", "Compact Design"],
  },
];

// Featured products for bottom section
const featuredProducts = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: "$199.99",
    originalPrice: "$249.99",
    image: "https://i.ibb.co.com/zLQ4149/facility4.jpg",
    category: "Electronics",
    rating: 4.8,
    features: ["Noise Cancelling", "24hr Battery", "Wireless Charging"],
  },
  {
    id: 2,
    name: "Premium Office Chair",
    price: "$499.99",
    originalPrice: "$599.99",
    image: "/api/placeholder/400/400",
    category: "Furniture",
    rating: 4.9,
    features: ["Ergonomic", "Breathable Mesh", "Adjustable"],
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: "$299.99",
    originalPrice: "$349.99",
    image: "/api/placeholder/400/400",
    category: "Wearables",
    rating: 4.7,
    features: ["Heart Monitor", "GPS Tracking", "Waterproof"],
  },
];

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSections.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentHero = heroSections[currentSlide];

  return (
    <div className="relative">
      {/* Main Hero Section */}
      <div 
        className={cn(
          "relative overflow-hidden min-h-[600px] md:min-h-[700px]",
          currentHero.bgColor,
          "transition-all duration-1000"
        )}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content - Left Side */}
            <div className="space-y-6 md:space-y-8 animate-slide-up">
              {/* Badge */}
              {currentHero.badge && (
                <span className={cn(
                  "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg",
                  currentHero.badgeColor
                )}>
                  <Sparkles className="h-3 w-3 mr-2" />
                  {currentHero.badge}
                </span>
              )}

              {/* Title and Subtitle */}
              <div>
                <h1 className={cn(
                  "text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none",
                  currentHero.textColor
                )}>
                  {currentHero.title}
                </h1>
                <h2 className={cn(
                  "text-3xl md:text-4xl lg:text-5xl font-bold mt-2",
                  currentHero.accentColor
                )}>
                  {currentHero.subtitle}
                </h2>
              </div>

              {/* Tagline */}
              <p className={cn(
                "text-xl md:text-2xl font-medium",
                currentHero.textColor === "text-white" ? "text-gray-300" : "text-gray-700"
              )}>
                {currentHero.tagline}
              </p>

              {/* Description */}
              <p className={cn(
                "text-lg md:text-xl max-w-xl leading-relaxed",
                currentHero.textColor === "text-white" ? "text-gray-400" : "text-gray-600"
              )}>
                {currentHero.description}
              </p>

              {/* Features List */}
              <div className="space-y-3">
                {currentHero.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className={cn(
                      "h-5 w-5 flex-shrink-0",
                      currentHero.accentColor
                    )} />
                    <span className={cn(
                      "text-sm md:text-base",
                      currentHero.textColor === "text-white" ? "text-gray-300" : "text-gray-700"
                    )}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className={cn(
                    "bg-primary hover:bg-primary/90 text-white",
                    "px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl",
                    "transition-all duration-300 transform hover:-translate-y-0.5"
                  )}
                  asChild
                >
                  <Link href={currentHero.buttonLink}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {currentHero.buttonText}
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "border-2 px-8 py-6 text-lg rounded-xl",
                    currentHero.textColor === "text-white" 
                      ? "border-white text-white hover:bg-white/10" 
                      : "border-gray-800 text-gray-800 hover:bg-gray-800/5"
                  )}
                  asChild
                >
                  <Link href="/products">
                    Browse All
                  </Link>
                </Button>
              </div>

              {/* Review Stats */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        currentHero.accentColor,
                        i < 4 ? "fill-current" : "text-gray-400"
                      )}
                    />
                  ))}
                </div>
                <span className={cn(
                  "text-sm",
                  currentHero.textColor === "text-white" ? "text-gray-300" : "text-gray-600"
                )}>
                  4.8/5 from 1,200+ reviews
                </span>
              </div>
            </div>

            {/* Product Image - Right Side */}
            <div className="relative">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl opacity-50"></div>
                
                {/* Main Product Image */}
                <div className="relative w-full aspect-square">
                  <div className={cn(
                    "absolute inset-0 rounded-3xl",
                    currentHero.textColor === "text-white" 
                      ? "bg-gradient-to-br from-gray-800 to-black shadow-2xl" 
                      : "bg-white shadow-2xl"
                  )}>
                    <Image
                      src={currentHero.image}
                      alt={currentHero.imageAlt}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  
                  {/* Price Tag */}
                  <div className={cn(
                    "absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg",
                    currentHero.textColor === "text-white" 
                      ? "bg-white text-gray-900" 
                      : "bg-gray-900 text-white"
                  )}>
                    From $399
                  </div>
                  
                  {/* Floating Feature Badge */}
                  <div className={cn(
                    "absolute bottom-8 left-1/2 transform -translate-x-1/2",
                    "px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm",
                    currentHero.textColor === "text-white" 
                      ? "bg-white/10 text-white border border-white/20" 
                      : "bg-black/10 text-gray-900 border border-gray-900/20"
                  )}>
                    🎯 Featured Product
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSections.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 3000);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "w-8 bg-primary"
                  : "bg-white/50 hover:bg-white"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSections.length) % heroSections.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <ChevronRight className="h-6 w-6 text-white rotate-180" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSections.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover p-6 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -20%
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {/* Features List */}
                <ul className="space-y-2 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {product.price}
                    </div>
                    <div className="text-sm text-gray-400 line-through">
                      {product.originalPrice}
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}