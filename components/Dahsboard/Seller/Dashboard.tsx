// components/Dahsboard/Seller/Dashboard/index.tsx
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

// Define interfaces
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

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
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
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  const primaryColor = '#83B734';

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
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

      // Fetch dashboard stats
      const statsRes = await fetch('http://localhost:5000/api/seller/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsRes.status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch recent orders
      const ordersRes = await fetch('http://localhost:5000/api/order/seller-orders?limit=5', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.data) {
          const recent = ordersData.data.slice(0, 5).map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.user?.name || 'Customer',
            amount: order.totalAmount,
            status: order.status,
            date: new Date(order.createdAt).toLocaleDateString()
          }));
          setRecentOrders(recent);
        }
      }

      // Generate sample data for charts (replace with actual API calls)
      generateSampleChartData();

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      // Use sample data for demo
      generateSampleData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Generate sample data for demo
  const generateSampleData = () => {
    setStats({
      totalProducts: 24,
      activeProducts: 18,
      totalOrders: 156,
      pendingOrders: 12,
      totalRevenue: 12560,
      thisMonthRevenue: 2340,
      totalCustomers: 89,
      conversionRate: 3.2
    });

    setRecentOrders([
      { id: '1', orderNumber: 'ORD-001', customerName: 'John Doe', amount: 245, status: 'DELIVERED', date: '2024-01-15' },
      { id: '2', orderNumber: 'ORD-002', customerName: 'Jane Smith', amount: 189, status: 'SHIPPED', date: '2024-01-14' },
      { id: '3', orderNumber: 'ORD-003', customerName: 'Robert Johnson', amount: 320, status: 'PROCESSING', date: '2024-01-14' },
      { id: '4', orderNumber: 'ORD-004', customerName: 'Sarah Williams', amount: 145, status: 'PENDING', date: '2024-01-13' },
      { id: '5', orderNumber: 'ORD-005', customerName: 'Michael Brown', amount: 275, status: 'CONFIRMED', date: '2024-01-12' }
    ]);

    generateSampleChartData();
  };

  // Generate sample chart data
  const generateSampleChartData = () => {
    // Product performance data
    const performanceData: ProductPerformance[] = [
      { name: 'Office Chair', orders: 45, revenue: 5400 },
      { name: 'Desk Lamp', orders: 32, revenue: 2560 },
      { name: 'Mouse Pad', orders: 28, revenue: 840 },
      { name: 'Webcam', orders: 22, revenue: 4400 },
      { name: 'Headphones', orders: 19, revenue: 3800 }
    ];
    setProductPerformance(performanceData);

    // Sales data for the last 6 months
    const monthlySales: SalesData[] = [
      { month: 'Jul', sales: 4200, orders: 28 },
      { month: 'Aug', sales: 5200, orders: 35 },
      { month: 'Sep', sales: 5800, orders: 42 },
      { month: 'Oct', sales: 6100, orders: 45 },
      { month: 'Nov', sales: 7200, orders: 52 },
      { month: 'Dec', sales: 8900, orders: 64 },
      { month: 'Jan', sales: 9400, orders: 68 }
    ];
    setSalesData(monthlySales);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderColor: primaryColor }}></div>
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
                {Math.round((stats.activeProducts / stats.totalProducts) * 100)}% active
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
              Serving customers worldwide
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
                    formatter={(value) => [`$${value}`, 'Sales']}
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
                    formatter={(value, name) => {
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
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                         style={{ backgroundColor: `${primaryColor}20` }}>
                      <ShoppingBag className="h-5 w-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">{order.customerName}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(order.amount)}</div>
                    <div className="text-sm text-gray-600">{order.date}</div>
                  </div>
                  
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/seller/orders/${order.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
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
                    {recentOrders.filter(o => o.status === 'CONFIRMED').length}
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