import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface LowStockAlertProps {
    products: any[];
    lowStockCount: number;
}

export default function LowStockAlert({ products, lowStockCount }: LowStockAlertProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                            <p className="text-sm text-gray-600">{lowStockCount} products need restocking</p>
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
                        {products.map((product) => (
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
                                    <button className="text-[#83B734] hover:text-[#6A9C2B] text-sm font-medium">
                                        Restock
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
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
    );
}