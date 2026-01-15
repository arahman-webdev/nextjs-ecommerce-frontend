import React from 'react';
import Image from 'next/image';

interface WatchCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  imageSrc?: string;
  altText?: string;
}

const WatchCard: React.FC<WatchCardProps> = ({
  title = 'Accessories for watch',
  description = 'Straps of Any Color',
  buttonText = 'TO SHOP',
  imageSrc = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=80',
  altText = 'Watch accessories',
}) => {
  const primaryColor = '#83B734';

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6">
      
      {/* Image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden group">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="text-center mt-4 sm:mt-6 space-y-2 sm:space-y-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          {title}
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
          {description}
        </p>

        <button
          className="mt-3 sm:mt-4 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          style={{ backgroundColor: primaryColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default WatchCard;
