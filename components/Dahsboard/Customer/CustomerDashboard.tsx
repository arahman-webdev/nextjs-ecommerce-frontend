// app/dashboard/customer/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag, Heart, Package, Clock,
  CheckCircle, XCircle, Truck, RefreshCw,
  Download, Eye, Star, MapPin, CreditCard,
  User, Settings, LogOut, Bell, Shield,
  MessageSquare, HelpCircle, ArrowRight,
  ChevronRight, Filter, Search, MoreVertical,
  Loader2, AlertCircle, Plus, Minus, Trash2,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: string;
  shippingMethod: string;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDelivery: string | null;
  customerNotes: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: Payment;

}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  variantId: string | null;
  createdAt: string;
  product: Product;
  variant: any;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  averageRating: number;
  reviewCount: number;
  totalOrders: number;
  productImages: ProductImage[];
  category: {
    name: string;
  } | null;
}

interface ProductImage {
  id: string;
  imageUrl: string;
  imageId: string;
}

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}



interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  product: Product;
}


export default function CustomerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    wishlistCount: 0,
    totalSpent: 0,
  });
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      // Set up common headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch orders
      const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/my-orders`, {
        headers,
      });

      if (!ordersResponse.ok) {
        console.error('Orders response status:', ordersResponse.status);
        console.error('Orders response text:', await ordersResponse.text());
        throw new Error(`Failed to fetch orders: ${ordersResponse.status}`);
      }

      const ordersData = await ordersResponse.json();
      console.log('Raw orders response:', ordersData);

      // Check different possible response structures
      let allOrders: Order[] = [];
      if (Array.isArray(ordersData)) {
        allOrders = ordersData;
      } else if (ordersData.data && Array.isArray(ordersData.data)) {
        allOrders = ordersData.data;
      } else if (ordersData.orders && Array.isArray(ordersData.orders)) {
        allOrders = ordersData.orders;
      } else if (ordersData.result && Array.isArray(ordersData.result)) {
        allOrders = ordersData.result;
      }

      console.log('Processed orders:', allOrders);

      // Fetch wishlist
      let wishlistData: WishlistItem[] = [];
      try {
        const wishlistResponse = await fetch('NEXT_PUBLIC_API_URL/wishlist/my-wishlist', {
          headers,
        });

        if (wishlistResponse.ok) {
          const wishlistResData = await wishlistResponse.json();
          console.log('Raw wishlist response:', wishlistResData);

          if (Array.isArray(wishlistResData)) {
            wishlistData = wishlistResData;
          } else if (wishlistResData.data && Array.isArray(wishlistResData.data)) {
            wishlistData = wishlistResData.data;
          } else if (wishlistResData.wishlist && Array.isArray(wishlistResData.wishlist)) {
            wishlistData = wishlistResData.wishlist;
          } else if (wishlistResData.result && Array.isArray(wishlistResData.result)) {
            wishlistData = wishlistResData.result;
          }
        } else {
          console.warn('Wishlist fetch failed:', wishlistResponse.status);
        }
      } catch (wishlistError) {
        console.warn('Wishlist fetch error:', wishlistError);
      }

      console.log('Processed wishlist:', wishlistData);

      // Calculate statistics
      const pendingOrders = allOrders.filter((order: Order) =>
        ['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.status)
      ).length;

      const deliveredOrders = allOrders.filter((order: Order) =>
        ['DELIVERED', 'COMPLETED'].includes(order.status)
      ).length;

      const cancelledOrders = allOrders.filter((order: Order) =>
        ['CANCELLED', 'REFUNDED'].includes(order.status)
      ).length;

      const totalSpent = allOrders
        .filter((order: Order) => ['DELIVERED', 'COMPLETED'].includes(order.status))
        .reduce((sum: number, order: Order) => sum + order.totalAmount, 0);

      // Update state
      setOrders(allOrders);
      setWishlist(wishlistData);
      setStats({
        totalOrders: allOrders.length,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        wishlistCount: wishlistData.length,
        totalSpent,
      });

    } catch (error: any) {
      console.error('Error fetching customer data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };


  console.log("from customer dashboard", orders)



  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config: any = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw, label: 'Processing' },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
      REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: ArrowRight, label: 'Refunded' },
    };

    const { color, icon: Icon, label } = config[status] || config.PENDING;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${wishlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== wishlistId));
        setStats(prev => ({
          ...prev,
          wishlistCount: prev.wishlistCount - 1
        }));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleReorder = (order: Order) => {
    // Implement reorder logic
    console.log('Reorder:', order);

  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchQuery) {
      return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return true;
  });

  const PaymentMethodBadge = ({ method }: { method: string }) => {
    const methods: any = {
      SSL_COMMERZ: { label: 'SSL Commerz', color: 'bg-blue-100 text-blue-800' },
      CREDIT_CARD: { label: 'Credit Card', color: 'bg-purple-100 text-purple-800' },
      PAYPAL: { label: 'PayPal', color: 'bg-yellow-100 text-yellow-800' },
      CASH_ON_DELIVERY: { label: 'Cash on Delivery', color: 'bg-green-100 text-green-800' },
    };

    const { label, color } = methods[method] || { label: method, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  console.log("from custmer", orders)

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-600">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </p>
            <p className="text-sm text-gray-600">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product?.productImages?.[0]?.imageUrl ? (
                  <Image
                    src={item.product.productImages[0].imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
                {item.product?.category && (
                  <span className="text-xs text-gray-500">
                    {item.product.category.name}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 2 && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                +{order.items.length - 2} more items
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href={`/dashboard/customer/orders/${order.id}`}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
          {order.status === 'DELIVERED' && (
            <button
              onClick={() => handleReorder(order)}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Reorder
            </button>
          )}
          {order.payment && (
            <div className="flex-1 py-3 px-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Payment</p>
                <PaymentMethodBadge method={order.payment.method} />
                <p className="text-xs text-gray-500 mt-1">
                  {order.payment.status}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const WishlistCard = ({ item }: { item: WishlistItem }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
      <Link href={`/products/${item.product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {item.product.productImages?.[0]?.imageUrl ? (
            <Image
              src={item.product.productImages[0].imageUrl}
              alt={item.product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleRemoveFromWishlist(item.id);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
          {item.product.stock < 10 && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              Low Stock
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <Link href={`/products/${item.product.slug}`} className="block">
              <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {item.product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
              {item.product.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{item.product.averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({item.product.reviewCount})</span>
          </div>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {item.product.category?.name || 'Uncategorized'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(item.product.price)}
            </p>
            <p className="text-xs text-gray-500">
              {item.product.stock} in stock
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back,
                </h1>
                <p className="text-gray-600">
                  Manage your orders, wishlist, and account settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-700">
                {error} (Showing demo data)
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wishlist</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.wishlistCount}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 md:gap-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'overview'
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                Overview
              </button>




            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <Link
                    href="/dashboard/customer/orders"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/dashboard/customer/orders"
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Order History</h3>
                      <p className="text-sm text-gray-600">View all your orders</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.totalOrders}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </Link>

                <Link
                  href="/dashboard/customer/wishlist"
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Wishlist</h3>
                      <p className="text-sm text-gray-600">Your saved items</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {stats.wishlistCount}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600" />
                  </div>
                </Link>

                <Link
                  href="/dashboard/customer/profile"
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Profile Settings</h3>
                      <p className="text-sm text-gray-600">Update your details</p>
                    </div>
                  </div>

                </Link>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

