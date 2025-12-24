'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

type ProductCardProps = {
  title: string
  description: string
  image: string
}

export default function FeatureCard({
  title,
  description,
  image,
}: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 ">
      
      {/* Image */}
      <div className="relative h-96 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="px-6 pb-8 pt-4 text-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>

        <Button
          className="mt-6 rounded-full px-6 opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          Shop Now
        </Button>
      </div>
    </div>
  )
}
