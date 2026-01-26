import { ArrowUpRight, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: 'up' | 'down';
    change?: number;
    subtitle?: string;
}

export default function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    change = 0,
    subtitle 
}: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {value}
            </h3>
            <p className="text-gray-600 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    );
}