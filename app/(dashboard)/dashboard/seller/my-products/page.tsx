
"use client";


import MyProductListing from "@/components/Dahsboard/Seller/MyPorducts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Define Product interface
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category?: {
    name: string;
  };
  productImages: { imageUrl: string }[];
  createdAt: string;
}

export default function MyProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get authentication tokens
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
      
      console.log('Auth check - Token:', token ? 'Found' : 'Not found', 'Role:', userRole);
      
      // Check if user is seller
      if (!['SELLER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole || '')) {
        setError('Access denied. Seller privileges required.');
        toast.error('Access denied. Seller privileges required.');
        setTimeout(() => router.push('/dashboard'), 2000);
        return;
      }
      
      if (!token) {
        setError('Please login first');
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      // Make API call
      const res = await fetch('http://localhost:5000/api/product/my-products', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('API Response Status:', res.status);

      // Handle unauthorized
      if (res.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Invalid response from server');
      }

      const result = await res.json();
      console.log('API Response Data:', result);
      
      if (!res.ok) {
        throw new Error(result.message || `HTTP ${res.status}: Failed to fetch products`);
      }

      if (!result.success) {
        setError(result.message || 'Failed to load products');
        toast.error(result.message || 'Failed to load products');
        return;
      }

      // Set products data
      const data = result?.data || [];
      console.log("Products loaded:", data.length);
      setProducts(data);
      
    } catch (error: any) {
      console.error('Error fetching products:', error);
      const errorMsg = error.message || 'Something went wrong';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" 
               style={{ borderColor: '#83B734' }}></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchProducts}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition font-medium"
              style={{ backgroundColor: '#83B734' }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard/seller')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Products Yet</h2>
          <p className="text-gray-600 mb-6">You haven't created any products yet. Start selling by adding your first product!</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/dashboard/seller/create-product')}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition font-medium"
              style={{ backgroundColor: '#83B734' }}
            >
              Create Your First Product
            </button>
            <button
              onClick={() => router.push('/dashboard/seller')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen p-4">
      <MyProductListing products={products} onRefresh={fetchProducts} />
    </div>
  );
}