// components/products/FilterSidebar.tsx
'use client';

import { Filter, X, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  category: string;
  categories: Array<{ id: string; name: string; icon: string }>;
  onCategoryChange: (categoryId: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onApplyFilters: () => void;
  onReset: () => void;
}

export default function FilterSidebar({
  category,
  categories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onApplyFilters,
  onReset,
}: FilterSidebarProps) {
  const priceMarks = [0, 100, 250, 500, 1000, 2500, 5000, 10000];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          Categories
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3",
                category === cat.id
                  ? 'bg-primary/10 text-primary border-2 border-primary/20'
                  : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
              )}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="font-medium">{cat.name}</span>
              {category === cat.id && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Price Range
        </h4>
        <div className="px-2">
          {/* Price Display */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-gray-700">
              ${priceRange[0]}
            </div>
            <div className="text-sm text-gray-500">to</div>
            <div className="text-sm font-medium text-gray-700">
              ${priceRange[1]}
            </div>
          </div>

          {/* Slider Track */}
          <div className="relative h-2 bg-gray-200 rounded-full mb-8">
            <div
              className="absolute h-full bg-primary rounded-full"
              style={{
                left: `${(priceRange[0] / 10000) * 100}%`,
                right: `${100 - (priceRange[1] / 10000) * 100}%`,
              }}
            />
            
            {/* Min Handle */}
            <input
              type="range"
              min="0"
              max="10000"
              step="10"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
              className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
            />
            
            {/* Max Handle */}
            <input
              type="range"
              min="0"
              max="10000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
              className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
            />

            {/* Custom Handles */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform z-20"
              style={{ left: `${(priceRange[0] / 10000) * 100}%`, marginLeft: '-12px' }}
            />
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform z-20"
              style={{ left: `${(priceRange[1] / 10000) * 100}%`, marginLeft: '-12px' }}
            />
          </div>

          {/* Price Marks */}
          <div className="flex justify-between text-xs text-gray-500">
            {priceMarks.map((mark) => (
              <button
                key={mark}
                onClick={() => {
                  if (mark <= priceRange[1]) {
                    onPriceChange([mark, priceRange[1]]);
                  }
                }}
                className={cn(
                  "hover:text-primary transition-colors",
                  priceRange[0] <= mark && mark <= priceRange[1] && "text-primary font-semibold"
                )}
              >
                ${mark === 10000 ? '10k+' : mark}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button
        onClick={onApplyFilters}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        Apply Filters
      </Button>
    </div>
  );
}