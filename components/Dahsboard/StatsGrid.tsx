import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight } from 'lucide-react';
import StatCard from './StatCard';


interface StatsGridProps {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        totalProducts: number;
        activeUsers: number;
        pendingOrders: number;
        lowStockProducts: number;
        conversionRate: number;
    };
}

export default function StatsGrid({ stats }: StatsGridProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={DollarSign}
                color="bg-gradient-to-br from-[#83B734] to-[#6A9C2B]"
                trend="up"
                change={15.3}
                subtitle="+$2,450 from last month"
            />

            <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={ShoppingCart}
                color="bg-gradient-to-br from-[#83B734] to-[#5A8C1F]"
                trend="up"
                change={8.2}
                subtitle={`${stats.pendingOrders} pending`}
            />

            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                color="bg-gradient-to-br from-[#83B734] to-[#4A7A1A]"
                trend="up"
                change={12.5}
                subtitle={`${stats.lowStockProducts} low stock`}
            />

            <StatCard
                title="Active Customers"
                value={stats.activeUsers}
                icon={Users}
                color="bg-gradient-to-br from-[#83B734] to-[#2C5C0A]"
                trend="up"
                change={5.7}
                subtitle={`${stats.conversionRate}% conversion`}
            />
        </div>
    );
}