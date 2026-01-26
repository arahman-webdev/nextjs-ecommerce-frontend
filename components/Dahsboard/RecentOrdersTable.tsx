import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';


interface RecentOrdersTableProps {
    orders: any[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    return (
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
                        {orders.map((order) => (
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
                        {orders.length === 0 && (
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
    );
}