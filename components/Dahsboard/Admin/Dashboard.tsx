'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Search, AlertCircle } from 'lucide-react';
import PageLoading from '@/components/SharedComponent/loadings/PageLoading';
import StatsGrid from '../StatsGrid';
import ChartsSection from '../ChartsSection';
import RecentOrdersTable from '../RecentOrdersTable';
import TopSellingProducts from '../TopSellingProducts';
import LowStockAlert from '../LowStockAlert';
import QuickStats from '../QuickStats';
import QuickActions from '../QuickActions';


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
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
    const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
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

            const userRole = localStorage.getItem('userRole');
            if (userRole !== 'ADMIN') {
                router.push('/dashboard');
                return;
            }

            // API calls
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            ]);

            // Handle responses and set data
            const usersData = await usersRes.json();
            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();

            const allUsers = usersData.data || usersData.users || [];
            const allProducts = productsData.data || productsData.products || [];
            const allOrders = ordersData.data || ordersData.orders || [];

            // Calculate statistics
            const activeUsers = allUsers.filter((user: any) => user.isActive !== false).length;
            const pendingOrdersList = allOrders.filter((order: any) => 
                order.status === 'PENDING' || order.status === 'PROCESSING'
            );
            const lowStockProductsList = allProducts.filter((product: any) => 
                product.stock < 10
            );
            
            const totalRevenue = allOrders.reduce((sum: number, order: any) => {
                if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
                    return sum + order.totalAmount;
                }
                return sum;
            }, 0);

            const avgOrderValue = allOrders.length > 0 
                ? Math.round(totalRevenue / allOrders.length * 100) / 100
                : 0;

            const conversionRate = activeUsers > 0
                ? Math.round((allOrders.length / activeUsers) * 100 * 100) / 100
                : 0;

            const refundsCount = allOrders.filter((order: any) => 
                order.status === 'REFUNDED' || order.status === 'CANCELLED'
            ).length;

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

            // Set lists
            setRecentUsers([...allUsers].sort((a:any, b:any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 5));

            setRecentOrders([...allOrders].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 5));

            setLowStockProducts(lowStockProductsList
                .sort((a:any, b:any) => a.stock - b.stock)
                .slice(0, 5));

            setTopSellingProducts([...allProducts]
                .sort((a, b) => b.totalOrders - a.totalOrders)
                .slice(0, 5));

            // Generate chart data
            setSalesData(generateSalesData(allOrders));
            setCategoryData(generateCategoryData(allProducts));

        } catch (error: any) {
            console.error('Error fetching admin data:', error);
            setError(error.message || 'Failed to load dashboard data');
            setMockData();
        } finally {
            setLoading(false);
        }
    };

    const generateSalesData = (orders: any[]) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => {
            const ordersForDay = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getDay() === index;
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

    const generateCategoryData = (products: any[]) => {
        const categoryMap = new Map();
        
        products.forEach(product => {
            const categoryName = product.category?.name || 'Uncategorized';
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        });
        
        const colors = ['#83B734', '#6A9C2B', '#9DCA5C', '#B5D889', '#4A7A1A', '#2C5C0A'];
        
        return Array.from(categoryMap.entries()).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }));
    };

    const setMockData = () => {
        // Mock data setup
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

        // Set mock arrays
        setRecentOrders([
            { id: '1', orderNumber: 'ORD-001', totalAmount: 275, status: 'DELIVERED', user: { name: 'Alex Johnson' }, createdAt: '2024-01-10T09:30:00Z', items: [] },
            { id: '2', orderNumber: 'ORD-002', totalAmount: 204.4, status: 'PROCESSING', user: { name: 'Sarah Miller' }, createdAt: '2024-01-10T14:20:00Z', items: [] },
        ]);

        setTopSellingProducts([
            { id: '1', name: 'iPhone 15 Pro', price: 999.99, totalOrders: 156, averageRating: 4.8, reviewCount: 125, category: { name: 'Electronics' }, stock: 45 },
            { id: '2', name: 'Nike Air Max', price: 129.99, totalOrders: 98, averageRating: 4.6, reviewCount: 89, category: { name: 'Fashion' }, stock: 12 },
        ]);

        setLowStockProducts([
            { id: '1', name: 'Wireless Earbuds Pro', stock: 3, price: 129.99, category: { name: 'Electronics' } },
            { id: '2', name: 'Organic Coffee Beans', stock: 2, price: 24.99, category: { name: 'Food' } },
        ]);

        setSalesData([
            { name: 'Mon', revenue: 4000, orders: 24 },
            { name: 'Tue', revenue: 3000, orders: 13 },
            { name: 'Wed', revenue: 2000, orders: 98 },
        ]);

        setCategoryData([
            { name: 'Electronics', value: 400, color: '#83B734' },
            { name: 'Fashion', value: 300, color: '#6A9C2B' },
        ]);
    };

    if (loading) {
        return <PageLoading message='admin dashboard' />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* <DashboardHeader 
                    stats={stats}
                    error={error}
                    onRefresh={fetchDashboardData}
                /> */}

                <StatsGrid stats={stats} />

                <ChartsSection 
                    salesData={salesData}
                    categoryData={categoryData}
                    totalRevenue={stats.totalRevenue}
                    totalProducts={stats.totalProducts}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <RecentOrdersTable orders={recentOrders} />
                    <TopSellingProducts products={topSellingProducts} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <LowStockAlert products={lowStockProducts} lowStockCount={stats.lowStockProducts} />
                    
                    <div className="space-y-6">
                        <QuickStats stats={stats} />
                        <QuickActions stats={stats} />
                    </div>
                </div>
            </div>
        </div>
    );
}