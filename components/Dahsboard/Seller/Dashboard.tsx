"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  PackageOpen,
  Truck,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  BarChart3,
  ShoppingBag
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Define interfaces based on your actual API data
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
  user: {
    id: string;
    name: string;
    email: string;
  };
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
  userId: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
  weight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
  productImages: ProductImage[];
  user: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    role: string;
  };
  category: {
    id: string;
    name: string;
    createdAt: string;
  };
}

interface ProductImage {
  id: string;
  imageUrl: string;
  imageId: string;
  productId: string;
  createdAt: string;
}

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  valId: string | null;
  bankTransaction: string | null;
  cardLast4: string | null;
  cardBrand: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  totalCustomers: number;
  conversionRate: number;
}

interface ProductPerformance {
  name: string;
  orders: number;
  revenue: number;
}

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    totalCustomers: 0,
    conversionRate: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  const primaryColor = '#83B734';

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-3 w-3" />;
      case 'PROCESSING':
        return <RefreshCw className="h-3 w-3" />;
      case 'SHIPPED':
        return <Truck className="h-3 w-3" />;
      case 'DELIVERED':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Process product data for chart
  const processProductData = (orders: Order[]) => {
    const productMap = new Map<string, { orders: number; revenue: number; name: string }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.orders += 1;
          existing.revenue += item.price * item.quantity;
        } else {
          productMap.set(item.productId, {
            name: item.name,
            orders: 1,
            revenue: item.price * item.quantity
          });
        }
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Process sales data for chart
  const processSalesData = (orders: Order[]) => {
    const monthMap = new Map<string, { sales: number; orders: number }>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = monthNames[date.getMonth()];
      
      const existing = monthMap.get(monthKey);
      if (existing) {
        existing.sales += order.totalAmount;
        existing.orders += 1;
      } else {
        monthMap.set(monthKey, {
          sales: order.totalAmount,
          orders: 1
        });
      }
    });
    
    // Get last 6 months
    const result: SalesData[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = monthNames[date.getMonth()];
      
      const data = monthMap.get(monthKey);
      result.push({
        month: monthName,
        sales: data?.sales || 0,
        orders: data?.orders || 0
      });
    }
    
    return result;
  };

  // Calculate dashboard stats from API data
  const calculateStats = (orders: Order[], products: Product[]) => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const totalOrders = orders.length;
    
    const pendingOrders = orders.filter(order => 
      ['PENDING', 'PROCESSING'].includes(order.status)
    ).length;
    
    const totalRevenue = orders
      .filter(order => ['DELIVERED', 'COMPLETED'].includes(order.status))
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate this month revenue
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const thisMonthRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === thisMonth && 
               orderDate.getFullYear() === thisYear &&
               ['DELIVERED', 'COMPLETED'].includes(order.status);
      })
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get unique customers
    const uniqueCustomers = new Set(orders.map(order => order.userId)).size;
    
    // Calculate conversion rate (simplified)
    const conversionRate = totalOrders > 0 ? (totalOrders / 100) * 100 : 0;
    
    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      thisMonthRevenue,
      totalCustomers: uniqueCustomers,
      conversionRate: parseFloat(conversionRate.toFixed(1))
    };
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      // Fetch seller orders
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/seller-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (ordersRes.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      let ordersData: Order[] = [];
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        console.log('Orders API response:', data);
        
        if (Array.isArray(data)) {
          ordersData = data;
        } else if (data.data && Array.isArray(data.data)) {
          ordersData = data.data;
        } else if (data.orders && Array.isArray(data.orders)) {
          ordersData = data.orders;
        } else if (data.result && Array.isArray(data.result)) {
          ordersData = data.result;
        }
      }
      

      // Fetch seller products
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/my-products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let productsData: Product[] = [];
      if (productsRes.ok) {
        const data = await productsRes.json();
        console.log('Products API response:', data);
        
        if (Array.isArray(data)) {
          productsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          productsData = data.data;
        } else if (data.products && Array.isArray(data.products)) {
          productsData = data.products;
        } else if (data.result && Array.isArray(data.result)) {
          productsData = data.result;
        }
      }

      // Calculate stats from fetched data
      const calculatedStats = calculateStats(ordersData, productsData);
      setStats(calculatedStats);

      // Set recent orders (latest 5)
      setRecentOrders(ordersData.slice(0, 5));

      // Process data for charts
      const productPerformanceData = processProductData(ordersData);
      setProductPerformance(productPerformanceData);

      const salesData = processSalesData(ordersData);
      setSalesData(salesData);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Use fallback sample data for demo
      generateSampleData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Generate sample data for demo (fallback)
  const generateSampleData = () => {
    setStats({
      totalProducts: 12,
      activeProducts: 10,
      totalOrders: 48,
      pendingOrders: 3,
      totalRevenue: 3250,
      thisMonthRevenue: 850,
      totalCustomers: 32,
      conversionRate: 2.5
    });

    const sampleOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-20250101-001',
        userId: '1',
        subtotal: 245,
        shippingFee: 10,
        tax: 15,
        discount: 0,
        totalAmount: 270,
        status: 'DELIVERED',
        shippingMethod: 'STANDARD',
        trackingNumber: 'TRK123456',
        carrier: 'UPS',
        estimatedDelivery: '2024-01-05',
        customerNotes: '',
        createdAt: '2024-01-01T10:30:00Z',
        updatedAt: '2024-01-05T14:20:00Z',
        items: [
          {
            id: 'item1',
            orderId: '1',
            productId: 'p1',
            quantity: 1,
            price: 245,
            name: 'Smart Watch',
            variantId: null,
            createdAt: '2024-01-01T10:30:00Z',
            product: {
              id: 'p1',
              name: 'Smart Watch',
              slug: 'smart-watch',
              description: 'Smart watch with fitness tracking',
              price: 245,
              stock: 50,
              userId: 'seller1',
              categoryId: 'cat1',
              metaTitle: 'Smart Watch',
              metaDescription: 'Smart watch with fitness tracking',
              weight: null,
              width: null,
              height: null,
              length: null,
              isActive: true,
              isFeatured: false,
              averageRating: 4.5,
              reviewCount: 10,
              totalOrders: 15,
              createdAt: '2024-01-01T10:30:00Z',
              updatedAt: '2024-01-01T10:30:00Z',
              productImages: [],
              user: {
                id: 'seller1',
                name: 'John Seller',
                email: 'john@seller.com',
                profilePhoto: null,
                role: 'SELLER'
              },
              category: {
                id: 'cat1',
                name: 'Electronics',
                createdAt: '2024-01-01T10:30:00Z'
              }
            },
            variant: null
          }
        ],
        payment: {
          id: 'pay1',
          orderId: '1',
          amount: 270,
          method: 'CREDIT_CARD',
          status: 'COMPLETED',
          transactionId: 'TXN123456',
          valId: null,
          bankTransaction: null,
          cardLast4: '1234',
          cardBrand: 'Visa',
          createdAt: '2024-01-01T10:30:00Z',
          updatedAt: '2024-01-01T10:30:00Z'
        },
        user: {
          id: 'cust1',
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    ];

    setRecentOrders(sampleOrders);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  // Quick actions
  const quickActions = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: 'Add Product',
      description: 'Create new product listing',
      action: () => router.push('/dashboard/seller/create-product'),
      color: 'bg-green-500'
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'View Orders',
      description: 'Manage all orders',
      action: () => router.push('/dashboard/seller/orders'),
      color: 'bg-blue-500'
    },
    {
      icon: <PackageOpen className="h-5 w-5" />,
      label: 'My Products',
      description: 'Manage your products',
      action: () => router.push('/dashboard/seller/my-products'),
      color: 'bg-purple-500'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Analytics',
      description: 'View detailed reports',
      action: () => router.push('/dashboard/seller/analytics'),
      color: 'bg-orange-500'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: primaryColor }}
          ></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => router.push('/dashboard/seller/create-product')}
            className="gap-2 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-5 w-5" style={{ color: primaryColor }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>
              {formatNumber(stats.totalProducts)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.activeProducts} Active
              </Badge>
              <div className="text-xs text-gray-500">
                {stats.totalProducts > 0 
                  ? Math.round((stats.activeProducts / stats.totalProducts) * 100) 
                  : 0}% active
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(stats.totalOrders)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-yellow-50">
                {stats.pendingOrders} Pending
              </Badge>
              <div className="text-xs text-gray-500">
                {stats.conversionRate.toFixed(1)}% conversion
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-xs">
                {stats.thisMonthRevenue > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600">
                      {formatCurrency(stats.thisMonthRevenue)} this month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-600">No sales this month</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(stats.totalCustomers)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.totalCustomers > 0 ? 'Serving customers' : 'No customers yet'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`$${value}`, 'Sales']}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke={primaryColor}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      name="Sales ($)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mb-2" />
                  <p>No sales data available</p>
                  <p className="text-sm">Start selling to see your performance</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Performance Chart */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {productPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fill: '#666', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') return [`$${value}`, 'Revenue'];
                        return [value, 'Orders'];
                      }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      fill={primaryColor}
                      name="Revenue ($)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#3b82f6"
                      name="Orders"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Package className="h-12 w-12 mb-2" />
                  <p>No product performance data</p>
                  <p className="text-sm">Make sales to see top products</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/seller/orders')}
              className="gap-2"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                          style={{ backgroundColor: `${primaryColor}20` }}>
                        <ShoppingBag className="h-5 w-5" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-600">
                          {order.user?.name || 'Customer'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right mx-4">
                      <div className="font-bold">{formatCurrency(order.totalAmount)}</div>
                      <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/seller/orders/${order.id}`)}
                        title="View order details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent orders</p>
                <p className="text-sm text-gray-500 mt-1">Start selling to see orders here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Store Status */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Store Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Products Active</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    {stats.activeProducts}/{stats.totalProducts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending Orders</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50">
                    {stats.pendingOrders}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Ready to Ship</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50">
                    {recentOrders.filter(o => o.status === 'CONFIRMED' || o.status === 'PROCESSING').length}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}