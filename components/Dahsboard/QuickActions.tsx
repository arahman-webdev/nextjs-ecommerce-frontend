import { Package, ShoppingCart, Users, BarChart } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
    stats: {
        pendingOrders: number;
        totalUsers: number;
    };
}

export default function QuickActions({ stats }: QuickActionsProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/dashboard/admin/products/new"
                    className="p-3 bg-gradient-to-br from-[#83B734]/10 to-[#6A9C2B]/10 hover:from-[#83B734]/20 hover:to-[#6A9C2B]/20 rounded-xl border border-[#83B734]/20 transition-all group"
                >
                    <Package className="h-5 w-5 text-[#83B734] mb-2" />
                    <h4 className="font-medium text-gray-900 text-sm">Add Product</h4>
                    <p className="text-xs text-gray-500">Create new listing</p>
                </Link>
                <Link
                    href="/dashboard/admin/orders"
                    className="p-3 bg-gradient-to-br from-[#83B734]/10 to-[#5A8C1F]/10 hover:from-[#83B734]/20 hover:to-[#5A8C1F]/20 rounded-xl border border-[#83B734]/20 transition-all group"
                >
                    <ShoppingCart className="h-5 w-5 text-[#83B734] mb-2" />
                    <h4 className="font-medium text-gray-900 text-sm">Process Orders</h4>
                    <p className="text-xs text-gray-500">{stats.pendingOrders} pending</p>
                </Link>
                <Link
                    href="/dashboard/admin/users"
                    className="p-3 bg-gradient-to-br from-[#83B734]/10 to-[#4A7A1A]/10 hover:from-[#83B734]/20 hover:to-[#4A7A1A]/20 rounded-xl border border-[#83B734]/20 transition-all group"
                >
                    <Users className="h-5 w-5 text-[#83B734] mb-2" />
                    <h4 className="font-medium text-gray-900 text-sm">Manage Users</h4>
                    <p className="text-xs text-gray-500">{stats.totalUsers} total</p>
                </Link>
                <Link
                    href="/dashboard/admin/analytics"
                    className="p-3 bg-gradient-to-br from-[#83B734]/10 to-[#2C5C0A]/10 hover:from-[#83B734]/20 hover:to-[#2C5C0A]/20 rounded-xl border border-[#83B734]/20 transition-all group"
                >
                    <BarChart className="h-5 w-5 text-[#83B734] mb-2" />
                    <h4 className="font-medium text-gray-900 text-sm">View Analytics</h4>
                    <p className="text-xs text-gray-500">Detailed reports</p>
                </Link>
            </div>
        </div>
    );
}