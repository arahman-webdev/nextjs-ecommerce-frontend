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

// Hero slides data
const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2024",
    subtitle: "Up to 50% OFF",
    description: "Discover the latest trends in fashion with our exclusive summer collection",
    image: "https://i.ibb.co.com/6cyVH1Xv/facility2.jpg", // Replace with your images
    imageAlt: "Summer Fashion Collection",
    buttonText: "Shop Now",
    buttonLink: "/collections/summer",
    bgColor: "from-blue-50 to-cyan-50",
    textColor: "text-blue-900",
    badge: "New Arrivals",
    badgeColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Electronics Sale",
    subtitle: "Flash Sale - Limited Time",
    description: "Get the best deals on smartphones, laptops, and smart devices",
    image: "/api/placeholder/1200/600",
    imageAlt: "Electronics Sale",
    buttonText: "View Deals",
    buttonLink: "/collections/electronics",
    bgColor: "from-purple-50 to-pink-50",
    textColor: "text-purple-900",
    badge: "Hot Deals",
    badgeColor: "bg-purple-500",
  },
  {
    id: 3,
    title: "Home & Living",
    subtitle: "Transform Your Space",
    description: "Premium quality furniture and home decor at affordable prices",
    image: "https://res.cloudinary.com/dvx6vfu8y/image/upload/v1766113194/products/zbw1fk1ynxramjaumurc.jpg",
    imageAlt: "Home Decor",
    buttonText: "Explore",
    buttonLink: "/collections/home",
    bgColor: "from-amber-50 to-orange-50",
    textColor: "text-amber-900",
    badge: "Best Sellers",
    badgeColor: "bg-amber-500",
  },
  {
    id: 4,
    title: "Fitness & Sports",
    subtitle: "Stay Active, Stay Healthy",
    description: "Professional gear for your fitness journey and outdoor adventures",
    image: "https://i.ibb.co.com/6RWTs176/slider-main-demo-1.jpg",
    imageAlt: "Sports Equipment",
    buttonText: "Get Fit",
    buttonLink: "/collections/sports",
    bgColor: "from-emerald-50 to-green-50",
    textColor: "text-emerald-900",
    badge: "Trending",
    badgeColor: "bg-emerald-500",
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
        className="relative overflow-hidden bg-[#F8F8F8] rounded-2xl mx-4 lg:mx-auto w-full mt-4 py-16 "
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
                      <div className="relative w-full h-full">
                        <div className="absolute -right-4 -top-4 bg-[#F8F8F8] to-transparent rounded-full blur-3xl"></div>
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="w-lg -mt-6 h-full rounded-2xl overflow-hidden transform  hover:rotate-0 transition-transform duration-500">
                            <Image
                              src={slide.image}
                              alt={slide.imageAlt}
                              width={700}
                              height={700}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          {/* Floating Badges */}
                          <div className="absolute -left-4 top-8 bg-white p-3 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold text-primary">50%</div>
                            <div className="text-xs text-gray-500">OFF</div>
                          </div>
                          <div className="absolute -right-4 bottom-8 bg-white p-3 rounded-xl shadow-lg">
                            <div className="text-xs font-semibold text-gray-900">Limited</div>
                            <div className="text-xs text-gray-500">Time Offer</div>
                          </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Trending Products Section */}
      <div className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trending <span className="text-primary">Products</span>
            </h2>
            <p className="text-gray-600">Best selling products this week</p>
          </div>
          <Link 
            href="/products" 
            className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                  SALE
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                  {product.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(product.rating) 
                              ? "fill-amber-400 text-amber-400" 
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mt-12">
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
      </div>

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