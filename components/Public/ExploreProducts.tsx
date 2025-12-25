// app/products/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Grid3X3, List, Star, ShoppingBag, Truck, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

// Loading component
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-primary/90 to-primary py-16">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-primary/70 rounded w-1/3 mb-4 mx-auto"></div>
          <div className="h-6 bg-primary/70 rounded w-1/2 mb-8 mx-auto"></div>
          <div className="max-w-3xl mx-auto">
            <div className="h-14 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow p-6 space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <div className="h-5 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products List Skeleton */}
          <div className="lg:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="space-y-2">
                <div className="h-7 bg-gray-300 rounded w-48"></div>
                <div className="h-5 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-11 bg-gray-300 rounded w-32"></div>
                <div className="h-11 bg-gray-300 rounded w-32"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main content component
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '10000')
  ]);
  const [sortBy, setSortBy] = useState<'price' | 'averageRating' | 'createdAt' | 'name'>(
    (searchParams.get('sortBy') as any) || 'createdAt'
  );
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>(
    (searchParams.get('orderBy') as any) || 'desc'
  );
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Available categories - you can fetch these from API
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home & Garden', icon: '🏠' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'books', name: 'Books', icon: '📚' },
  ];

  // Build query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (page !== 1) params.append('page', page.toString());
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (category) params.append('category', category);
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 10000) params.append('maxPrice', priceRange[1].toString());
    if (sortBy !== 'createdAt') params.append('sortBy', sortBy);
    if (orderBy !== 'desc') params.append('orderBy', orderBy);
    
    return params;
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = buildQueryParams();
      params.append('limit', '12'); // Products per page
      
      // Update URL
      const queryString = params.toString();
      const newUrl = queryString ? `/products?${queryString}` : '/products';
      
      if (!isInitialLoad) {
        router.push(newUrl);
      }

      const response = await fetch(`http://localhost:5000/api/product?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
        setTotalProducts(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (!isInitialLoad) {
      fetchProducts();
    }
  }, [page]);

  // Fetch when sort changes
  useEffect(() => {
    if (!isInitialLoad) {
      setPage(1);
      fetchProducts();
    }
  }, [sortBy, orderBy]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // Handle category toggle
  const handleCategoryToggle = (catId: string) => {
    setCategory(catId === category ? '' : catId);
    setPage(1);
    setTimeout(() => fetchProducts(), 0);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setPriceRange([0, 10000]);
    setSortBy('createdAt');
    setOrderBy('desc');
    setPage(1);
    setTimeout(() => fetchProducts(), 0);
  };

  // Sort options
  const sortOptions = [
    { value: 'createdAt', label: 'Newest', order: 'desc' },
    { value: 'price', label: 'Price: Low to High', order: 'asc' },
    { value: 'price', label: 'Price: High to Low', order: 'desc' },
    { value: 'averageRating', label: 'Rating: High to Low', order: 'desc' },
    { value: 'name', label: 'Name: A to Z', order: 'asc' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Find exactly what you're looking for with our curated collection
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-12 pr-24 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-3 focus:ring-primary/30 shadow-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Truck className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Free Shipping</h3>
                  <p className="text-sm text-primary-foreground/80">On orders over $50</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Secure Payment</h3>
                  <p className="text-sm text-primary-foreground/80">100% protected</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Star className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Premium Quality</h3>
                  <p className="text-sm text-primary-foreground/80">Verified products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <FilterSidebar
                category={category}
                categories={categories}
                onCategoryChange={handleCategoryToggle}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onApplyFilters={() => {
                  setPage(1);
                  fetchProducts();
                }}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Products List */}
          <div className="lg:w-3/4">
            {/* Header with controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : `${totalProducts} Products Found`}
                </h2>
                <p className="text-gray-600">
                  Showing {products.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'grid' 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-gray-600 hover:text-primary'
                    )}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'list' 
                        ? 'bg-white text-primary shadow-sm' 
                        : 'text-gray-600 hover:text-primary'
                    )}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={`${sortBy}-${orderBy}`}
                  onChange={(e) => {
                    const [newSortBy, newOrderBy] = e.target.value.split('-');
                    setSortBy(newSortBy as any);
                    setOrderBy(newOrderBy as any);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                >
                  {sortOptions.map((option, index) => (
                    <option key={index} value={`${option.value}-${option.order}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || category || priceRange[0] > 0 || priceRange[1] < 10000) && (
              <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-primary">Active Filters:</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-primary/70">
                        ×
                      </button>
                    </span>
                  )}
                  {category && (
                    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                      Category: {categories.find(c => c.id === category)?.name}
                      <button onClick={() => setCategory('')} className="ml-1 hover:text-primary/70">
                        ×
                      </button>
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                    <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-1">
                      Price: ${priceRange[0]} - ${priceRange[1]}
                      <button onClick={() => setPriceRange([0, 10000])} className="ml-1 hover:text-primary/70">
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={cn(
                    "bg-white rounded-xl shadow overflow-hidden animate-pulse",
                    viewMode === 'list' && "flex"
                  )}>
                    <div className={cn(
                      "bg-gray-300",
                      viewMode === 'grid' ? "h-56" : "w-48 h-48"
                    )} />
                    <div className="p-4 flex-1">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Products Grid/List */}
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                )}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* No Results */}
                {products.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                    <Button
                      onClick={handleResetFilters}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {totalProducts > 0 && totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      totalItems={totalProducts}
                      itemsPerPage={12}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}