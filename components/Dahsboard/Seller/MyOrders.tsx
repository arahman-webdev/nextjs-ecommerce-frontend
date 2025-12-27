// components/Dahsboard/Seller/MyOrders.tsx (Updated Actions section)
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Eye, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Define interfaces
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  productImages: Array<{ imageUrl: string }>;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  product: Product;
}

interface Payment {
  id: string;
  status: string;
  method: string;
  amount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  createdAt: string;
  estimatedDelivery: string | null;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  payment: Payment | null;
  shippingMethod: string;
  trackingNumber: string | null;
}

interface SellerOrdersProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, status: Order["status"]) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function SellerOrders({ orders, onStatusUpdate, onRefresh }: SellerOrdersProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      case 'REFUNDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status update
  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      setLoadingId(orderId);
      await onStatusUpdate(orderId, newStatus);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex gap-1.5 items-center">
        <Package size={30} className="text-primary" />
        My Product Orders
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Order #</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 transition">
                {/* Order Number */}
                <TableCell className="font-medium text-gray-900">
                  {order.orderNumber}
                </TableCell>

                {/* Customer */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-xs text-gray-600">
                        {order.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Product */}
                <TableCell>
                  {order.items.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {order.items[0].product.productImages?.[0]?.imageUrl ? (
                          <Image
                            src={order.items[0].product.productImages[0].imageUrl}
                            alt={order.items[0].product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{order.items[0].product.name}</div>
                        <div className="text-xs text-gray-600">
                          {order.items[0].quantity} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </TableCell>

                {/* Total */}
                <TableCell className="font-bold">
                  {formatCurrency(order.totalAmount)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge className={`${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </TableCell>

                {/* Payment */}
                <TableCell>
                  {order.payment ? (
                    <Badge className={order.payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {order.payment.status}
                    </Badge>
                  ) : (
                    <span className="text-gray-500 text-sm">No payment</span>
                  )}
                </TableCell>

                {/* Date */}
                <TableCell>
                  {formatDate(order.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right space-x-3">
                  {/* PENDING → CONFIRM / CANCEL / PROCESSING */}
                  {order.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Confirm"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-purple-500 text-white hover:bg-purple-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "PROCESSING")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Process"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </>
                  )}

                  {/* CONFIRMED → PROCESSING / SHIP / CANCEL */}
                  {order.status === "CONFIRMED" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-purple-500 text-white hover:bg-purple-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "PROCESSING")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Process"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "SHIPPED")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Ship"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </>
                  )}

                  {/* PROCESSING → SHIP / CANCEL */}
                  {order.status === "PROCESSING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-indigo-500 text-white hover:bg-indigo-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "SHIPPED")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Ship"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-red-500 text-white hover:bg-red-600"
                        disabled={loadingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                      >
                        {loadingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </>
                  )}

                  {/* SHIPPED → DELIVERED */}
                  {order.status === "SHIPPED" && (
                    <Button
                      size="sm"
                      className="bg-green-500 text-white hover:bg-green-600"
                      disabled={loadingId === order.id}
                      onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                    >
                      {loadingId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Mark as Delivered"
                      )}
                    </Button>
                  )}

                  {/* DELIVERED / CANCELLED / REFUNDED → no actions */}
                  {(order.status === "DELIVERED" || 
                    order.status === "CANCELLED" || 
                    order.status === "REFUNDED") && (
                    <span className="text-gray-400 text-sm">No actions available</span>
                  )}

                
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Count */}
        <div className="pt-4 font-semibold text-gray-900">
          Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}