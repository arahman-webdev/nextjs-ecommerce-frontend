// components/hero/HeroSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingBag, Tag, Truck, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import type { Swiper as SwiperType } from 'swiper';

// https://i.ibb.co.com/6c6QxT95/laptop-2.jpg
// https://i.ibb.co.com/s9J0Z07h/sony-virtual-2.jpg

// Hero slides data
const heroSlides = [
  {
    id: 1,
    title: "Panton Tunior Chair",
    subtitle: "Stylish & Comfortable",
    description: "Discover the Panton Tunior Chair: sleek, modern, and ergonomically designed for comfort and elegance. Perfect for home or office, this chair blends style with durability.",
    image: "https://res.cloudinary.com/dvx6vfu8y/image/upload/v1766900865/product-images/gqy3ogif3gb1oclmdu2o.jpg",
    imageAlt: "Panton Tunior Chair",
    buttonText: "Shop Now",
    buttonLink: "/products/panton-tunior-chair",
    bgColor: "from-blue-50 to-cyan-50",
    textColor: "text-blue-900",
    badge: "New Arrival",
    badgeColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Smart Watches Wood Edition",
    subtitle: "Tech Meets Nature",
    description: "Combine technology and sustainability with our Smart Watches Wood Edition. Track fitness, receive notifications, and enjoy a unique wood finish that stands out.",
    image: "https://res.cloudinary.com/dvx6vfu8y/image/upload/v1766901439/product-images/fiws309sfl2aawi2ehdx.jpg",
    imageAlt: "Smart Watches Wood Edition",
    buttonText: "View Product",
    buttonLink: "/products/smart-watches-wood-edition",
    bgColor: "from-purple-50 to-pink-50",
    textColor: "text-purple-900",
    badge: "Trending",
    badgeColor: "bg-purple-500",
  },
 

  {
    id: 3,
    title: "iPhone Dock",
    subtitle: "Charge in Style",
    description: "Keep your iPhone secure and powered up with our sleek iPhone Dock. Compact, elegant, and perfect for desks or nightstands.",
    image: "https://res.cloudinary.com/dvx6vfu8y/image/upload/v1766900146/product-images/crbfxdcne7t15x8hhzbz.jpg",
    imageAlt: "iPhone Dock",
    buttonText: "Buy Now",
    buttonLink: "/products/iphone-dock",
    bgColor: "from-yellow-50 to-red-50",
    textColor: "text-red-900",
    badge: "Hot",
    badgeColor: "bg-red-500",
  },

];


// Feature cards
const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Tag,
    title: "Best Price",
    description: "Guaranteed lowest prices",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Curated products",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
];

// Mini product cards for bottom section
const trendingProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$89.99",
    originalPrice: "$129.99",
    image: "/api/placeholder/400/400",
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Sports Running Shoes",
    price: "$64.99",
    originalPrice: "$89.99",
    image: "/api/placeholder/400/400",
    category: "Sports",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Designer Handbag",
    price: "$149.99",
    originalPrice: "$199.99",
    image: "/api/placeholder/400/400",
    category: "Fashion",
    rating: 4.3,
  },
];

export default function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Handle slide change
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (swiperInstance && swiperInstance.autoplay.running) {
      swiperInstance.autoplay.stop();
      setIsAutoplayPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (swiperInstance && isAutoplayPaused) {
      swiperInstance.autoplay.start();
      setIsAutoplayPaused(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Hero Slider */}
      <div 
        className="relative overflow-hidden bg-[#FBFBFB] rounded-2xl mx-4 lg:mx-auto w-full mt-4 py-16 "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} bg-primary w-3 h-3"></span>`;
            },
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          loop={true}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          className="h-[500px] md:h-[600px] rounded-2xl"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className={cn(
                "relative w-full h-full flex items-center",
                slide.bgColor
              )}>
              

                {/* Content */}
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div className="text-left space-y-6 animate-slide-up">
                      {slide.badge && (
                        <span className={cn(
                          "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg",
                          slide.badgeColor
                        )}>
                          {slide.badge}
                        </span>
                      )}
                      
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        <span className={cn("block", slide.textColor)}>
                          {slide.title}
                        </span>
                        <span className="block text-primary mt-2">
                          {slide.subtitle}
                        </span>
                      </h1>
                      
                      <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                        {slide.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                          asChild
                        >
                          <Link href={slide.buttonLink}>
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            {slide.buttonText}
                          </Link>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-xl"
                          asChild
                        >
                          <Link href="/products">
                            Browse All
                          </Link>
                        </Button>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-6 pt-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">10K+</div>
                          <div className="text-sm text-gray-600">Happy Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">5K+</div>
                          <div className="text-sm text-gray-600">Products</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">24/7</div>
                          <div className="text-sm text-gray-600">Support</div>
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                   <div className="relative hidden md:block">
  <div className="relative w-full h-[420px] flex items-center justify-center">
    <div className="max-w-lg w-full rounded-2xl overflow-hidden">
      <Image
        src={slide.image}
        alt={slide.imageAlt}
        width={700}
        height={700}
        priority
        className="w-full h-full object-contain"
      />
    </div>

    {/* Floating badges */}
    <div className="absolute left-0 top-8 bg-white p-3 rounded-xl shadow-lg">
      <div className="text-2xl font-bold text-primary">50%</div>
      <div className="text-xs text-gray-500">OFF</div>
    </div>

    <div className="absolute right-0 bottom-8 bg-white p-3 rounded-xl shadow-lg">
      <div className="text-xs font-semibold">Limited</div>
      <div className="text-xs text-gray-500">Offer</div>
    </div>
  </div>
</div>

                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hidden md:flex items-center justify-center">
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
          <button className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hidden md:flex items-center justify-center">
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>

          {/* Progress Bar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-48 hidden md:block">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${((activeIndex + 1) / heroSlides.length) * 100}%` }}
              />
            </div>
          </div>
        </Swiper>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperInstance?.slideTo(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                activeIndex === index 
                  ? "bg-primary w-8" 
                  : "bg-white/50 hover:bg-white"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-4 flex items-center space-x-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={cn("p-3 rounded-lg", feature.bgColor)}>
                <feature.icon className={cn("h-6 w-6", feature.color)} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

     

      {/* Newsletter Section */}
      {/* <div className="container mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Stay Updated with Deals
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 15% off your first order!
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div> */}

      {/* CSS for custom animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        /* Custom Swiper styles */
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        
        .swiper-pagination-bullet-active {
          background: #83B734 !important;
          width: 30px;
          border-radius: 8px;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          display: none;
        }
      `}</style>
    </div>
  );
}