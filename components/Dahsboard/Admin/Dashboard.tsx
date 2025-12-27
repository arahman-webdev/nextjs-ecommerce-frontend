// app/dashboard/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Package, CreditCard, TrendingUp,
    Activity, Shield, ShoppingCart, BarChart3,
    Eye, Star, DollarSign, CheckCircle,
    XCircle, Clock, Filter, Download,
    Search, MoreVertical, ArrowUpRight,
    Loader2, PieChart, Layers, Tag,
    RefreshCw, AlertCircle, TrendingDown,
    ShoppingBag, Store, Percent, BarChart
} from 'lucide-react';
import Link from 'next/link';
import {
    LineChart, Line, BarChart as ReBarChart, Bar,
    PieChart as RePieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    userId: string;
    categoryId: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
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
    productImages: any[];
    category: {
        id: string;
        name: string;
        createdAt: string;
    } | null;
}

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
    items: any[];
    user: {
        name: string;
        email: string;
    };
    payment: {
        status: string;
        method: string;
        transactionId: string;
    };
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    profilePhoto: string | null;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        activeUsers: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        refunds: 0,
    });
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [error, setError] = useState('');

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

            // Check if user is admin
            const userRole = localStorage.getItem('userRole');
            if (userRole !== 'ADMIN') {
                router.push('/dashboard');
                return;
            }

            // Fetch data from all APIs
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                fetch('http://localhost:5000/api/auth/users', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://localhost:5000/api/product', {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://localhost:5000/api/order', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            ]);

            // Handle users response
            if (!usersRes.ok) {
                throw new Error(`Failed to fetch users: ${usersRes.status}`);
            }
            const usersData = await usersRes.json();
            const allUsers = usersData.data || usersData.users || [];

            // Handle products response
            if (!productsRes.ok) {
                throw new Error(`Failed to fetch products: ${productsRes.status}`);
            }
            const productsData = await productsRes.json();
            const allProducts = productsData.data || productsData.products || [];

            // Handle orders response
            if (!ordersRes.ok) {
                throw new Error(`Failed to fetch orders: ${ordersRes.status}`);
            }
            const ordersData = await ordersRes.json();
            const allOrders = ordersData.data || ordersData.orders || [];

            console.log('Fetched data:', {
                users: allUsers.length,
                products: allProducts.length,
                orders: allOrders.length
            });

            // Calculate statistics
            const activeUsers = allUsers.filter((user: User) => user.isActive !== false).length;
            const pendingOrdersList = allOrders.filter((order: Order) => 
                order.status === 'PENDING' || order.status === 'PROCESSING'
            );
            const lowStockProductsList = allProducts.filter((product: Product) => 
                product.stock < 10
            );
            
            // Calculate total revenue from completed orders
            const totalRevenue = allOrders.reduce((sum: number, order: Order) => {
                if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
                    return sum + order.totalAmount;
                }
                return sum;
            }, 0);

            // Calculate average order value
            const avgOrderValue = allOrders.length > 0 
                ? Math.round(totalRevenue / allOrders.length * 100) / 100
                : 0;

            // Calculate conversion rate (orders per active user)
            const conversionRate = activeUsers > 0
                ? Math.round((allOrders.length / activeUsers) * 100 * 100) / 100
                : 0;

            // Get refunds count
            const refundsCount = allOrders.filter((order: Order) => 
                order.status === 'REFUNDED' || order.status === 'CANCELLED'
            ).length;

            // Get recent users (last 5)
            const sortedUsers = [...allUsers].sort((a: User, b: User) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            const recentUsersList = sortedUsers.slice(0, 5);

            // Get recent orders (last 5)
            const sortedOrders = [...allOrders].sort((a: Order, b: Order) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            const recentOrdersList = sortedOrders.slice(0, 5);

            // Get low stock products (5 most critical)
            const criticalLowStock = lowStockProductsList
                .sort((a: Product, b: Product) => a.stock - b.stock)
                .slice(0, 5);

            // Get top selling products
            const topSellers = [...allProducts]
                .sort((a: Product, b: Product) => b.totalOrders - a.totalOrders)
                .slice(0, 5);

            // Generate sales data for charts (last 7 days)
            const salesChartData = generateSalesData(allOrders);
            
            // Generate category data
            const categoryChartData = generateCategoryData(allProducts);

            // Update state
            setStats({
                totalUsers: allUsers.length,
                totalProducts: allProducts.length,
                totalOrders: allOrders.length,
                totalRevenue,
                pendingOrders: pendingOrdersList.length,
                lowStockProducts: lowStockProductsList.length,
                activeUsers,
                conversionRate,
                avgOrderValue,
                refunds: refundsCount,
            });

            setRecentUsers(recentUsersList);
            setRecentOrders(recentOrdersList);
            setLowStockProducts(criticalLowStock);
            setTopSellingProducts(topSellers);
            setSalesData(salesChartData);
            setCategoryData(categoryChartData);

        } catch (error: any) {
            console.error('Error fetching admin data:', error);
            setError(error.message || 'Failed to load dashboard data');

            // Fallback to mock data
            setMockData();
        } finally {
            setLoading(false);
        }
    };

    const generateSalesData = (orders: Order[]) => {
        // Generate last 7 days data
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => {
            const ordersForDay = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                const dayIndex = orderDate.getDay();
                return dayIndex === index;
            });
            
            const revenue = ordersForDay.reduce((sum, order) => sum + order.totalAmount, 0);
            const ordersCount = ordersForDay.length;
            
            return {
                name: day,
                revenue: revenue,
                orders: ordersCount,
                visitors: Math.floor(Math.random() * 200) + 100,
                conversion: ordersCount > 0 ? Math.round((ordersCount / 150) * 100 * 100) / 100 : 0
            };
        });
    };

    const generateCategoryData = (products: Product[]) => {
        const categoryMap = new Map();
        
        products.forEach(product => {
            const categoryName = product.category?.name || 'Uncategorized';
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        });
        
        const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
        
        return Array.from(categoryMap.entries()).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }));
    };

    const setMockData = () => {
        setStats({
            totalUsers: 1247,
            totalProducts: 356,
            totalOrders: 892,
            totalRevenue: 45230,
            pendingOrders: 23,
            lowStockProducts: 15,
            activeUsers: 1058,
            conversionRate: 4.8,
            avgOrderValue: 150.75,
            refunds: 42,
        });

        setRecentUsers([
            { id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2024-01-10T10:30:00Z', profilePhoto: null },
            { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2024-01-10T08:15:00Z', profilePhoto: null },
            { id: '3', name: 'Mike Chen', email: 'mike@example.com', role: 'CUSTOMER', isActive: true, createdAt: '2024-01-09T16:45:00Z', profilePhoto: null },
            { id: '4', name: 'Emma Wilson', email: 'emma@example.com', role: 'ADMIN', isActive: true, createdAt: '2024-01-09T14:20:00Z', profilePhoto: null },
            { id: '5', name: 'David Brown', email: 'david@example.com', role: 'CUSTOMER', isActive: false, createdAt: '2024-01-08T11:10:00Z', profilePhoto: null },
        ]);

        setRecentOrders([
            { 
                id: '1', 
                orderNumber: 'ORD-20240110-001', 
                userId: '1', 
                subtotal: 250, 
                shippingFee: 15, 
                tax: 20, 
                discount: 10, 
                totalAmount: 275, 
                status: 'DELIVERED', 
                shippingMethod: 'EXPRESS', 
                trackingNumber: 'TRK123456', 
                carrier: 'UPS', 
                estimatedDelivery: '2024-01-12', 
                customerNotes: '', 
                createdAt: '2024-01-10T09:30:00Z', 
                updatedAt: '2024-01-10T09:30:00Z', 
                items: [], 
                user: { name: 'Alex Johnson', email: 'alex@example.com' }, 
                payment: { status: 'COMPLETED', method: 'CREDIT_CARD', transactionId: 'TXN123' } 
            },
            { 
                id: '2', 
                orderNumber: 'ORD-20240110-002', 
                userId: '2', 
                subtotal: 180, 
                shippingFee: 10, 
                tax: 14.4, 
                discount: 0, 
                totalAmount: 204.4, 
                status: 'PROCESSING', 
                shippingMethod: 'STANDARD', 
                trackingNumber: null, 
                carrier: null, 
                estimatedDelivery: '2024-01-15', 
                customerNotes: 'Please deliver after 5 PM', 
                createdAt: '2024-01-10T14:20:00Z', 
                updatedAt: '2024-01-10T14:20:00Z', 
                items: [], 
                user: { name: 'Sarah Miller', email: 'sarah@example.com' }, 
                payment: { status: 'COMPLETED', method: 'PAYPAL', transactionId: 'TXN124' } 
            },
        ]);

        setLowStockProducts([
            { id: '1', name: 'Wireless Earbuds Pro', stock: 3, price: 129.99, category: { name: 'Electronics' } } as any,
            { id: '2', name: 'Organic Coffee Beans', stock: 2, price: 24.99, category: { name: 'Food' } } as any,
            { id: '3', name: 'Yoga Mat Premium', stock: 5, price: 89.99, category: { name: 'Fitness' } } as any,
        ]);

        setTopSellingProducts([
            { id: '1', name: 'iPhone 15 Pro', totalOrders: 156, price: 999.99, averageRating: 4.8 } as any,
            { id: '2', name: 'Nike Air Max', totalOrders: 98, price: 129.99, averageRating: 4.6 } as any,
            { id: '3', name: 'Kitchen Blender', totalOrders: 76, price: 89.99, averageRating: 4.4 } as any,
        ]);

        setSalesData([
            { name: 'Mon', revenue: 4000, orders: 24, visitors: 240, conversion: 10 },
            { name: 'Tue', revenue: 3000, orders: 13, visitors: 221, conversion: 5.9 },
            { name: 'Wed', revenue: 2000, orders: 98, visitors: 321, conversion: 30.5 },
            { name: 'Thu', revenue: 2780, orders: 39, visitors: 189, conversion: 20.6 },
            { name: 'Fri', revenue: 1890, orders: 48, visitors: 267, conversion: 18 },
            { name: 'Sat', revenue: 2390, orders: 38, visitors: 178, conversion: 21.3 },
            { name: 'Sun', revenue: 3490, orders: 43, visitors: 198, conversion: 21.7 },
        ]);

        setCategoryData([
            { name: 'Electronics', value: 400, color: '#0088FE' },
            { name: 'Fashion', value: 300, color: '#00C49F' },
            { name: 'Home & Garden', value: 300, color: '#FFBB28' },
            { name: 'Books', value: 200, color: '#FF8042' },
            { name: 'Sports', value: 278, color: '#8884D8' },
            { name: 'Beauty', value: 189, color: '#82CA9D' },
        ]);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const StatCard = ({ title, value, icon: Icon, color, trend, change, subtitle }: any) => (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' && title.includes('Revenue') ? formatCurrency(value) : 
                 typeof value === 'number' && title.includes('Order') ? formatCurrency(value) :
                 typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            <p className="text-gray-600 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    );

    const StatusBadge = ({ status }: { status: string }) => {
        const config: any = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
            SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Package },
            DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
            REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: ArrowUpRight },
            FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle },
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const { color, icon: Icon } = config[status] || config.PENDING;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </span>
        );
    };

    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Managing {stats.totalProducts} products, {stats.totalOrders} orders, and {stats.totalUsers} customers
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchDashboardData}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <p className="text-yellow-700 text-sm">
                                    {error} (Showing demo data)
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={stats.totalRevenue}
                        icon={DollarSign}
                        color="bg-gradient-to-br from-green-500 to-emerald-500"
                        trend="up"
                        change={15.3}
                        subtitle="+$2,450 from last month"
                    />

                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={ShoppingCart}
                        color="bg-gradient-to-br from-blue-500 to-cyan-500"
                        trend="up"
                        change={8.2}
                        subtitle={`${stats.pendingOrders} pending`}
                    />

                    <StatCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={Package}
                        color="bg-gradient-to-br from-purple-500 to-pink-500"
                        trend="up"
                        change={12.5}
                        subtitle={`${stats.lowStockProducts} low stock`}
                    />

                    <StatCard
                        title="Active Customers"
                        value={stats.activeUsers}
                        icon={Users}
                        color="bg-gradient-to-br from-orange-500 to-amber-500"
                        trend="up"
                        change={5.7}
                        subtitle={`${stats.conversionRate}% conversion`}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Sales Overview Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                                <p className="text-sm text-gray-600">Last 7 days performance</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Revenue: </span>
                                <span className="font-semibold text-green-600">{formatCurrency(stats.totalRevenue)}</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip 
                                        formatter={(value) => [typeof value === 'number' ? formatCurrency(value) : value]}
                                        labelFormatter={(label) => `Day: ${label}`}
                                    />
                                    <Legend />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        name="Revenue" 
                                        stroke="#10b981" 
                                        fill="#10b981" 
                                        fillOpacity={0.2} 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="orders" 
                                        name="Orders" 
                                        stroke="#3b82f6" 
                                        fill="#3b82f6" 
                                        fillOpacity={0.2} 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Categories Distribution */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Categories Distribution</h2>
                                <p className="text-sm text-gray-600">Products by category</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Total: </span>
                                <span className="font-semibold text-gray-900">{stats.totalProducts}</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Products']} />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                        <p className="text-sm text-gray-600">Latest transactions</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/admin/orders"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{order.orderNumber}</div>
                                                <div className="text-sm text-gray-500">{order.items?.length || 0} items</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-medium text-gray-900">{order.user?.name}</div>
                                                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                                        <p className="text-sm text-gray-600">Best performing items</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/admin/products"
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {topSellingProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-gray-900">
                                                {formatCurrency(product.price)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-medium text-gray-900">{product.totalOrders}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {renderRating(product.averageRating)}
                                                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.stock < 10 
                                                        ? 'bg-red-100 text-red-800'
                                                        : product.stock < 20
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {product.stock} left
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {topSellingProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No products found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Low Stock Alert */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                                        <p className="text-sm text-gray-600">{stats.lowStockProducts} products need restocking</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/admin/inventory"
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Manage →
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    product.stock < 5 
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-gray-900">
                                                {formatCurrency(product.price)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    Restock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {lowStockProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                All products are well-stocked
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Stats & Actions */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Avg Order Value</span>
                                        <Percent className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(stats.avgOrderValue)}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Refunds</span>
                                        <RefreshCw className="h-4 w-4 text-red-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stats.refunds}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Conversion Rate</span>
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stats.conversionRate}%
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Pending Orders</span>
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stats.pendingOrders}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/dashboard/admin/products/new"
                                    className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border border-blue-200 transition-all group"
                                >
                                    <Package className="h-5 w-5 text-blue-600 mb-2" />
                                    <h4 className="font-medium text-gray-900 text-sm">Add Product</h4>
                                    <p className="text-xs text-gray-500">Create new listing</p>
                                </Link>
                                <Link
                                    href="/dashboard/admin/orders"
                                    className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all group"
                                >
                                    <ShoppingCart className="h-5 w-5 text-green-600 mb-2" />
                                    <h4 className="font-medium text-gray-900 text-sm">Process Orders</h4>
                                    <p className="text-xs text-gray-500">{stats.pendingOrders} pending</p>
                                </Link>
                                <Link
                                    href="/dashboard/admin/users"
                                    className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border border-purple-200 transition-all group"
                                >
                                    <Users className="h-5 w-5 text-purple-600 mb-2" />
                                    <h4 className="font-medium text-gray-900 text-sm">Manage Users</h4>
                                    <p className="text-xs text-gray-500">{stats.totalUsers} total</p>
                                </Link>
                                <Link
                                    href="/dashboard/admin/analytics"
                                    className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl border border-orange-200 transition-all group"
                                >
                                    <BarChart className="h-5 w-5 text-orange-600 mb-2" />
                                    <h4 className="font-medium text-gray-900 text-sm">View Analytics</h4>
                                    <p className="text-xs text-gray-500">Detailed reports</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}