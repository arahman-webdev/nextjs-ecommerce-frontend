// components/Dahsboard/Seller/MyProducts.tsx
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
import { Eye, Trash2, Loader2, Edit, Package, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationAlert } from "@/components/SharedComponent/ConfirmationAlert";
import { toast } from "sonner";

// Define Product interface
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category?: {
    name: string;
  };
  productImages: { imageUrl: string }[];
  createdAt: string;
}

interface MyProductListingProps {
  products: Product[];
  onRefresh: () => void;
}

export default function MyProductListing({ products, onRefresh }: MyProductListingProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get token
  const getToken = () => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token');
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update product status
  const updateStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoadingId(id);
      const token = getToken();

      if (!token) {
        toast.error('Please login again');
        router.push('/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/status/${id}`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            isActive: !currentStatus 
          }),
        }
      );

      if (res.status === 401) {
        toast.error("Session expired");
        localStorage.clear();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Status update failed: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Status updated successfully");
        onRefresh(); // Refresh the product list
      } else {
        toast.error(data.message || "Update failed");
      }

    } catch (error: any) {
      console.error("Status Update Error:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);
      const token = getToken();

      if (!token) {
        toast.error('Please login again');
        router.push('/login');
        return;
      }

      const res = await fetch(
        `NEXT_PUBLIC_API_URL/product/${id}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error("Session expired");
        localStorage.clear();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete failed: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Product deleted successfully");
        onRefresh(); // Refresh the product list
      } else {
        toast.error(data.message || "Delete failed");
      }

    } catch (error: any) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setLoadingId(null);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      toast.success('Products refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const primaryColor = '#83B734';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-8 h-8" style={{ color: primaryColor }} />
            My Products
          </h1>
          <p className="text-gray-600 mt-1">Manage and track your product listings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => router.push('/dashboard/seller/create-product')}
            size="sm"
            className="gap-2 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Package className="w-4 h-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Total Products</div>
          <div className="text-2xl font-bold mt-1" style={{ color: primaryColor }}>
            {products.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Active Products</div>
          <div className="text-2xl font-bold mt-1" style={{ color: primaryColor }}>
            {products.filter(p => p.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">Total Stock</div>
          <div className="text-2xl font-bold mt-1" style={{ color: primaryColor }}>
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Product Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.productImages?.[0]?.imageUrl ? (
                          <Image
                            src={product.productImages[0].imageUrl}
                            alt={product.name}
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
                        <div className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="font-semibold">
                    {formatPrice(product.price)}
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"}`}>
                      {product.stock} units
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"}`}>
                      {product.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(product.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Activate/Deactivate */}
                      <Button
                        onClick={() => updateStatus(product.id, product.isActive)}
                        disabled={loadingId === product.id}
                        variant={product.isActive ? "outline" : "default"}
                        size="sm"
                        className={`min-w-[100px] h-8 ${product.isActive
                          ? "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                          : "bg-green-500 text-white hover:bg-green-600"}`}
                      >
                        {loadingId === product.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : product.isActive ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/seller/edit-product/${product.slug}`)}
                        className="h-8 w-8"
                        title="Edit Product"
                      >
                        <Edit size={16} className="text-blue-600" />
                      </Button>

                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/products/${product.slug}`)}
                        className="h-8 w-8"
                        title="View Product"
                      >
                        <Eye size={16} className="text-green-600" />
                      </Button>

                      {/* Delete with Confirmation */}
                      {/* <ConfirmationAlert /> */}
                      Confirmation
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-gray-600">
            Total Value: {formatPrice(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
          </div>
        </div>
      </div>
    </div>
  );
}