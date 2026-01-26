import { Percent, RefreshCw, TrendingUp, Clock } from 'lucide-react';

interface QuickStatsProps {
    stats: {
        avgOrderValue: number;
        refunds: number;
        conversionRate: number;
        pendingOrders: number;
    };
}

export default function QuickStats({ stats }: QuickStatsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Avg Order Value</span>
                        <Percent className="h-4 w-4 text-[#83B734]" />
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
                        <TrendingUp className="h-4 w-4 text-[#83B734]" />
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
    );
}