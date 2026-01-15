'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import type { Swiper as SwiperType } from 'swiper'

// Slide data - Updated with your content
const slides = [
  {
    id: 1,
    title: 'Wardenpt – Modern Pattern.',
    designer: 'Ross Gardam',
    materials: 'Fabric, Steel',
    client: 'Loft Studio',
    price: 299,
    image: 'https://i.ibb.co.com/5CfSW4j/home-sliding-2.png',
    description:
      'A beautifully crafted modern pattern that combines organic materials with expensive, intricate complex patterns. Animals\' founder chair designed for numerous landscapes of mid-century modern design.',
  },
  {
    id: 2,
    title: 'Modern Image Spaces',
    designer: 'Ghislain Magrite',
    materials: 'Wood, Ceramic, Metal',
    client: 'Woodmart, Basel',
    price: 499,
    image: 'https://i.ibb.co.com/pjgQVtR0/home-sliding-3.png',
    description:
      'Experience ultimate comfort with this minimalist lounge chair designed for modern living spaces.',
  },
  {
    id: 3,
    title: 'Vitra Chair – Classic Design',
    designer: 'Charles & Ray Eames',
    materials: 'Wood, Leather, Metal',
    client: 'Woodmart, Basel',
    price: 1999,
    image: 'https://i.ibb.co.com/Mk30S2gQ/home-sliding-1.png',
    description: 'A timeless masterpiece of mid-century modern design.',
  },
]

export default function HomeProductSlider() {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <section className="relative overflow-hidden bg-[#7BB532] w-full min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20">

        {/* Header */}
        <div className="mb-6 sm:mb-10 lg:mb-12 text-center text-white">
          <p className="text-xs sm:text-sm lg:text-base uppercase tracking-widest opacity-80">
            Product landing page
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
            Featured Products
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade"
          speed={800}
          loop
          fadeEffect={{ crossFade: true }}
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 lg:grid-cols-2 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">

                {/* Image - Fixed positioning */}
                <div className="relative mx-auto w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[600px] aspect-square">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Content - Improved text handling */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8 text-white h-full flex flex-col justify-center">
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.5rem] font-bold leading-tight mb-3 sm:mb-4">
                      {slide.title}
                    </h3>
                    <div className="max-h-[120px] sm:max-h-[140px] md:max-h-[160px] overflow-y-auto pr-2">
                      <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl opacity-80 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid - Vertical layout for better readability */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div className="space-y-2">
                      <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur">
                        <p className="text-xs xs:text-xs sm:text-sm uppercase opacity-70 mb-1">DESIGNER</p>
                        <p className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl">{slide.designer}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur">
                        <p className="text-xs xs:text-xs sm:text-sm uppercase opacity-70 mb-1">MATERIALS</p>
                        <p className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl">{slide.materials}</p>
                      </div>
                    </div>
                    
                    <div className="xs:col-span-2 space-y-2">
                      <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur">
                        <p className="text-xs xs:text-xs sm:text-sm uppercase opacity-70 mb-1">CLIENT</p>
                        <p className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl">{slide.client}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price & Button - Fixed to bottom */}
                  <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                    <div className="flex-1">
                      <p className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold">
                        ${slide.price}.00
                      </p>
                    </div>

                    <div className="flex-1 xs:flex-none">
                      <Button
                        size={isMobile ? "default" : "lg"}
                        className="w-full xs:w-auto rounded-lg xs:rounded-xl bg-gray-900 hover:bg-gray-800 px-4 xs:px-5 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-5 md:py-6 text-sm xs:text-base sm:text-lg transition-all duration-300 hover:scale-105"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation - Responsive visibility */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="hidden sm:flex absolute left-2 xs:left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 xs:p-2.5 sm:p-3 backdrop-blur hover:bg-white/30 transition-all z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="text-white h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="hidden sm:flex absolute right-2 xs:right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 xs:p-2.5 sm:p-3 backdrop-blur hover:bg-white/30 transition-all z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="text-white h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Dots - Fixed positioning */}
        <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center gap-1.5 xs:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={`h-1.5 xs:h-2 w-1.5 xs:w-2 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? 'bg-gray-900 scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}