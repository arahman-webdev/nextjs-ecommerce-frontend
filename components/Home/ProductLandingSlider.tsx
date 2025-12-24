'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import type { Swiper as SwiperType } from 'swiper'

// Slide data
const slides = [
  {
    id: 1,
    title: 'Woodspot – Modern Pattern.',
    designer: 'Ghislain Magrite',
    materials: 'Wood, Ceramic, Metal',
    client: 'Woodmart, Basel',
    price: 299,
    image: 'https://i.ibb.co.com/5CfSW4j/home-sliding-2.png',
    description:
      'A beautifully crafted modern pattern that combines organic materials with contemporary design.',
  },
  {
    id: 2,
    title: 'Minimal Lounge Chair',
    designer: 'Ross Gardam',
    materials: 'Fabric, Steel',
    client: 'Loft Studio',
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
    description:
      'A timeless masterpiece of mid-century modern design.',
  },
  {
    id: 4,
    title: 'Smart Watch Ultra 2',
    designer: 'Apple Design Team',
    materials: 'Titanium, Ceramic',
    client: 'Apple Inc.',
    price: 799,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900',
    description:
      'Next level adventure with touch-free control and the brightest display ever.',
  },
]

export default function HomeProductSlider() {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative overflow-hidden bg-[#7BB532]">
      <div className="container mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 text-center text-white">
          <p className="text-sm uppercase tracking-widest opacity-80">
            Product landing page
          </p>
          <h2 className="mt-2 text-4xl font-bold">
            Featured Products
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid items-center gap-12 lg:grid-cols-2">

                {/* Image */}
                <div className="relative mx-auto aspect-square max-w-xl">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Content */}
                <div className="space-y-8 text-white">
                  <div>
                    <h3 className="text-4xl font-bold">
                      {slide.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-lg opacity-80">
                      {slide.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 rounded-xl bg-white/10 p-6 backdrop-blur">
                    <div>
                      <p className="text-sm uppercase opacity-70">Designer</p>
                      <p className="font-semibold">{slide.designer}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase opacity-70">Materials</p>
                      <p className="font-semibold">{slide.materials}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase opacity-70">Client</p>
                      <p className="font-semibold">{slide.client}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <p className="text-5xl font-bold">
                      ${slide.price}.00
                    </p>
                    <Button
                      size="lg"
                      className="rounded-xl bg-gray-900 px-8 py-6 text-lg hover:bg-gray-800"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur hover:bg-white/30"
        >
          <ChevronLeft className="text-white" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur hover:bg-white/30"
        >
          <ChevronRight className="text-white" />
        </button>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={`h-2 w-2 rounded-full transition ${
                activeIndex === i
                  ? 'bg-gray-900 scale-125'
                  : 'bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
