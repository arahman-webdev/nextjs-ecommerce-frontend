'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PromoBanners() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT BANNER */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#FBFBFB] min-h-[320px]">
          <div className="relative z-10 p-8 md:p-10 max-w-sm">
            <p className="text-primary text-sm font-medium mb-2">
              Something completely new
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Cases for Phone
            </h2>

            <Link
              href="/products?category=phone-cases"
              className={cn(
                "inline-flex items-center justify-center",
                "bg-primary text-white px-6 py-3 rounded-xl",
                "text-sm font-semibold transition-colors",
                "hover:bg-primary/90"
              )}
            >
              TO SHOP
            </Link>
          </div>

          


          {/* Image */}
          <div className="absolute -right-16 bottom-0 w-[72%] h-full">
            <Image
              src="https://i.ibb.co.com/jvsy42gS/product-furniture-6.jpg" // replace with your image
              alt="Phone Cases"
              fill
              className="object-cover transition-transform duration-500 group-hover:translate-5"
              priority
            />
          </div>
        </div>

        {/* RIGHT BANNER */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#FBFBFB] min-h-[320px]">
          <div className="relative z-10 p-8 md:p-10 max-w-sm">
            <p className="text-primary text-sm font-medium mb-2">
              Accessories for watch
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Straps of Any Color
            </h2>

            <Link
              href="/products?category=watch-accessories"
              className={cn(
                "inline-flex items-center justify-center",
                "border border-gray-300 text-gray-900",
                "px-6 py-3 rounded-lg text-sm font-semibold",
                "hover:bg-gray-900 hover:text-white transition-colors"
              )}
            >
              TO SHOP
            </Link>
          </div>

          {/* Image */}
          <div className="absolute right-0 bottom-0 w-[72%] h-full">
            <Image
              src="https://i.ibb.co.com/5gW8HcqF/product-furniture-3.jpg" // replace with your image
              alt="Watch Straps"
              fill
              className="object-cover transition-transform duration-500 group-hover:-translate-4"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}
