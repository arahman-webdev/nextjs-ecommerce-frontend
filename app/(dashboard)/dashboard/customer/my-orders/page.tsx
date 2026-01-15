// app/dashboard/seller/orders/page.tsx
'use client';

import CusotmerOrders from "@/components/Dahsboard/Customer/MyOrders";
import SellerOrders from "@/components/Dahsboard/Seller/MyOrders";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { toast } from "sonner";





export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      console.log('Fetching orders - Token:', token ? 'Found' : 'Not found', 'Role:', userRole);
      
      // Check if user is seller
      if (!['CUSTOMER'].includes(userRole || '')) {
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/my-orders`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Orders API Response status:', res.status);
      
      if (res.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      // Check response content type
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Invalid response from server');
      }

      const result = await res.json();
      console.log('Orders API response:', result);
      
      if (!res.ok) {
        throw new Error(result.message || `HTTP ${res.status}: Failed to fetch orders`);
      }

      if (!result.success) {
        setError(result.message || 'Failed to load orders');
        toast.error(result.message || 'Failed to load orders');
        return;
      }

      const ordersData = result.data || [];
      console.log("Orders data loaded:", ordersData.length);
      setOrders(ordersData);
      
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      const errorMsg = err.message || 'Failed to load orders';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const res = await fetch(`NEXT_PUBLIC_API_URL/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        toast.error('Session expired');
        localStorage.clear();
        router.push('/login');
        return;
      }

      const result = await res.json();
      
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Refresh orders
        fetchOrders();
      } else {
        toast.error(result.message || 'Failed to update order status');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" 
               style={{ borderColor: '#83B734' }}></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={fetchOrders}
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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't received any orders yet. Share your products to start receiving orders!</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/dashboard/seller/my-products')}
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition font-medium"
              style={{ backgroundColor: '#83B734' }}
            >
              View My Products
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

  return <CusotmerOrders orders={orders} onStatusUpdate={updateOrderStatus} onRefresh={fetchOrders} />;
}