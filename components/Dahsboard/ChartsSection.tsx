'use client';

import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartsSectionProps {
    salesData: any[];
    categoryData: any[];
    totalRevenue: number;
    totalProducts: number;
}

export default function ChartsSection({ salesData, categoryData, totalRevenue, totalProducts }: ChartsSectionProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
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
                        <span className="font-semibold text-[#83B734]">{formatCurrency(totalRevenue)}</span>
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                                formatter={(value) => [typeof value === 'number' ? formatCurrency(Number(value)) : value]}
                                labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Legend />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                name="Revenue" 
                                stroke="#83B734" 
                                fill="#83B734" 
                                fillOpacity={0.2} 
                            />
                            <Area 
                                type="monotone" 
                                dataKey="orders" 
                                name="Orders" 
                                stroke="#6A9C2B" 
                                fill="#6A9C2B" 
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
                        <span className="font-semibold text-gray-900">{totalProducts}</span>
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
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
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}