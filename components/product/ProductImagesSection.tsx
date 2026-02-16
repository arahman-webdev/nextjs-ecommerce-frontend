'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Maximize2, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  X,
} from 'lucide-react';
import { ProductImage } from '@/types/order';

interface ProductImagesSectionProps {
  product: any;
  images: ProductImage[];
}

export default function ProductImagesSection({ product, images }: ProductImagesSectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thumbnails to show selected image
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const thumbnail = thumbnailContainerRef.current.children[selectedImageIndex] as HTMLElement;
      if (thumbnail) {
        thumbnailContainerRef.current.scrollTo({
          left: thumbnail.offsetLeft - thumbnailContainerRef.current.offsetWidth / 2 + thumbnail.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedImageIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };



  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const dragEndX = 'touches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const dragDistance = dragEndX - dragStartX.current;
    
    // Minimum drag distance to trigger swipe
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0 && selectedImageIndex > 0) {
        // Swipe right - previous image
        setSelectedImageIndex(prev => prev - 1);
      } else if (dragDistance < 0 && selectedImageIndex < images.length - 1) {
        // Swipe left - next image
        setSelectedImageIndex(prev => prev + 1);
      }
    }
  };

  const handleThumbnailDrag = (e: React.WheelEvent) => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollLeft += e.deltaY;
    }
  };



  const nextImage = () => {
    setSelectedImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'Escape') setIsFullscreen(false);
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length]);

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      {/* Main Image Container with Swipe Gestures */}
      <motion.div
        ref={mainImageRef}
        className="relative bg-gray-50 rounded-2xl overflow-hidden group border aspect-square"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
      
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image with Framer Motion Swipe Animation */}
        <AnimatePresence mode="wait" custom={selectedImageIndex}>
          <motion.div
            key={selectedImageIndex}
            custom={selectedImageIndex}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="relative w-full h-full"
          >
            <Image
              src={images[selectedImageIndex]?.imageUrl}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-300 ",
                isZoomed ? " scale-150" : "scale-100"
              )}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                cursor: isZoomed ? 'zoom-out' : 'zoom-in'
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Indicator */}
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 cursor-pointer"
          >
            <div
              className="absolute w-64 h-64  bg-green-50/20"
              style={{
                left: `calc(${zoomPosition.x}% - 128px)`,
                top: `calc(${zoomPosition.y}% - 128px)`,
              }}
            />
          </motion.div>
        )}

        {/* Badges with Animation */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <AnimatePresence>
            {product.isFeatured && (
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                style={{ backgroundColor: '#83B734' }}
              >
                FEATURED
              </motion.div>
            )}
            {product.totalOrders > 50 && (
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
              >
                POPULAR
              </motion.div>
            )}
            {product.averageRating >= 4.5 && (
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
              >
                <Star className="h-3 w-3 fill-white" />
                TOP RATED
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image Actions */}
        <motion.div 
          className="absolute top-4 right-4 flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setIsZoomed(!isZoomed)}
            className="h-10 w-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="h-4 w-4" />
          </motion.button>
          
        
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedImageIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedImageIndex === images.length - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {selectedImageIndex + 1} / {images.length}
        </motion.div>
      </motion.div>

      {/* Thumbnail Slider with Horizontal Scroll */}
      <div className="relative">
        <div
          ref={thumbnailContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
          onWheel={handleThumbnailDrag}
        >
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              onClick={() => setSelectedImageIndex(i)}
              className={cn(
                'flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-xl overflow-hidden transition-all duration-200 relative',
                selectedImageIndex === i
                  ? 'border-primary ring-2 ring-primary/20 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              style={selectedImageIndex === i ? { borderColor: '#83B734' } : {}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.imageUrl}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              {selectedImageIndex === i && (
                <motion.div
                  className="absolute inset-0 bg-primary/10 border-2 border-primary"
                  style={{ borderColor: '#83B734' }}
                  layoutId="activeThumbnail"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Thumbnail Navigation Indicators */}
        {images.length > 4 && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 z-10 h-12 w-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full max-w-4xl h-3/4"
                >
                  <Image
                    src={images[selectedImageIndex]?.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Toggle Button */}
      <motion.button
        onClick={() => setIsFullscreen(true)}
        className="w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
        style={{ backgroundColor: '#83B7341A', color: '#83B734' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Maximize2 className="h-4 w-4" />
        View Fullscreen
      </motion.button>
    </div>
  );
}