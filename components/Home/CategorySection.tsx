// components/categories/CategorySection.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight,
  Clock,
  Headphones,
  Smartphone,
  Watch,
  Shirt,
  Home,
  Heart,
  Package,
  BookOpen,
  Utensils,
  Gamepad2,
  Camera,
  Music,
  Car,
  Dumbbell
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Default icon fallback
const defaultIcon = Package;

// Icon mapping for common categories
const iconMap: Record<string, React.ComponentType<any>> = {
  electronics: Smartphone,
  fashion: Shirt,
  clothing: Shirt,
  apparel: Shirt,
  'home-living': Home,
  home: Home,
  furniture: Home,
  beauty: Heart,
  cosmetics: Heart,
  accessories: Headphones,
  jewelry: Heart,
  books: BookOpen,
  kitchen: Utensils,
  gaming: Gamepad2,
  photography: Camera,
  music: Music,
  automotive: Car,
  sports: Dumbbell,
  watches: Watch,
  clocks: Clock,
  headphones: Headphones,
};

type CategoryType = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
  imageUrl?: string;
};

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_URL}/product/all-category`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle different API response formats
        let categoriesData: CategoryType[] = [];
        
        if (data.success && Array.isArray(data.data)) {
          categoriesData = data.data.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
            productCount: cat.productCount || cat._count?.products || 0,
            imageUrl: cat.imageUrl || cat.image || null,
          }));
        } else if (Array.isArray(data)) {
          categoriesData = data.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
            productCount: cat.productCount || 0,
            imageUrl: cat.imageUrl || null,
          }));
        }
        
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to load categories');
        setCategories([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get icon for category based on name or slug
  const getCategoryIcon = (category: CategoryType) => {
    const lowerName = category.name.toLowerCase();
    const lowerSlug = category.slug.toLowerCase();
    
    // Try to match by common keywords in name
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key) || lowerSlug.includes(key)) {
        return icon;
      }
    }
    
    return defaultIcon;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error or empty state
  if (error || categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error ? 'Failed to load categories' : 'No categories found'}
          </h3>
          <p className="text-gray-600">
            {error || 'Categories will appear here once added to the system.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header - Clean & Minimal */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Browse Categories
        </h2>
        <p className="text-gray-600">
          Find what you're looking for
        </p>
      </div>

      {/* Categories Grid - Simple Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category);
          
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={cn(
                "group bg-white rounded-lg border border-gray-200",
                "p-4 transition-all duration-200",
                "hover:border-primary hover:shadow-md",
                "flex flex-col items-center text-center"
              )}
            >
              {/* Icon/Image Circle */}
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                "bg-gray-50 group-hover:bg-primary/5 transition-colors"
              )}>
                {category.imageUrl ? (
                  <div className="relative w-12 h-12">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const iconDiv = document.createElement('div');
                          iconDiv.className = 'flex items-center justify-center';
                          iconDiv.innerHTML = `<${Icon} class="h-6 w-6 text-gray-600" />`;
                          parent.appendChild(iconDiv);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Icon className="h-6 w-6 text-gray-600" />
                )}
              </div>

              {/* Category Name */}
              <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors text-sm line-clamp-1">
                {category.name}
              </h3>

              {/* Product Count (if available) */}
              {category.productCount !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  {category.productCount} items
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* "View All" Link - Simple */}
      {categories.length > 12 && (
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            View All Categories
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Minimal Styles */}
      <style jsx global>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
}