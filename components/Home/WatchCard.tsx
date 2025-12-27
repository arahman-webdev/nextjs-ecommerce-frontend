// components/WatchCard.tsx
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
  imageSrc = '/images/watch-accessories.jpg', // Replace with your actual image path
  altText = 'Watch accessories'
}) => {
  const primaryColor = '#83B734';

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
      {/* Image Container with hover effect */}
      <div className="relative w-64 h-64 mb-6 overflow-hidden rounded-lg group">
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          {/* Fallback if image doesn't load */}
          <svg className="w-32 h-32 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        {/* Next.js Image component - replace with your actual image */}
        {/* <Image 
          src={imageSrc}
          alt={altText}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, 256px"
        /> */}
        
        {/* Fallback div that simulates the image scaling effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500 ease-out"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
      
      {/* Content Section */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h2>
        
        <p className="text-lg text-gray-600 font-medium">
          {description}
        </p>
        
        <button
          className="px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-opacity duration-200"
          style={{ backgroundColor: primaryColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default WatchCard;