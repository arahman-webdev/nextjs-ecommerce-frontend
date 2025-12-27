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
import { Eye, Trash2, Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Define Product type
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  averageRating: number;
  reviewCount: number;
  totalOrders: number;
  productImages: { imageUrl: string }[];
  user?: {
    name: string;
    email: string;
  };
  category?: {
    name: string;
  };
}

interface ManageProductListingTableProps {
  products: Product[];
}

export default function ManageProductListingTable({ products }: ManageProductListingTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || localStorage.getItem('token');
    }
    return null;
  };

  // Update product status
  const updateStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoadingId(id);

      // Get token
      const token = getToken();
      
      if (!token) {
        toast.error("Please login again");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      // Use PATCH or PUT based on your backend
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
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Status update error:', errorText);
        throw new Error(`Status update failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Status update success:', data);

      if (data.success) {
        toast.success(data.message || "Status updated successfully");
        router.refresh(); // Refresh the page data
      } else {
        toast.error(data.message || "Update failed");
      }

    } catch (error: any) {
      console.error("Status Update Error:", error);
      toast.error(error.message || "Failed to update product status");
    } finally {
      setLoadingId(null);
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoadingId(productToDelete);

      const token = getToken();
      
      if (!token) {
        toast.error("Please login again");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        toast.error("Session expired");
        localStorage.clear();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete error:', errorText);
        throw new Error(`Delete failed: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Product deleted successfully");
        router.refresh(); // Refresh the page data
      } else {
        toast.error(data.message || "Delete failed");
      }

    } catch (error: any) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setLoadingId(null);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  // View product details
  const viewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex gap-1.5 items-center">
        <Package size={30} className="text-primary" />
        Manage Product Listings
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Product</TableHead>
                <TableHead className="font-semibold text-gray-900">Seller</TableHead>
                <TableHead className="font-semibold text-gray-900">Price</TableHead>
                <TableHead className="font-semibold text-gray-900">Stock</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products?.length > 0 ? (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Product Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
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
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {product.category?.name || "Uncategorized"}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Seller */}
                    <TableCell>
                      <div className="font-medium">
                        {product.user?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {product.user?.email || "No email"}
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-semibold">
                      {formatPrice(product.price)}
                    </TableCell>

                    {/* Stock */}
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.stock} in stock
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {product.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Activate / Deactivate */}
                        <Button
                          onClick={() => updateStatus(product.id, product.isActive)}
                          disabled={loadingId === product.id}
                          variant={product.isActive ? "outline" : "default"}
                          size="sm"
                          className={`min-w-[100px] ${product.isActive
                            ? "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                            : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                        >
                          {loadingId === product.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : product.isActive ? (
                            "Deactivate"
                          ) : (
                            "Activate"
                          )}
                        </Button>

                        {/* View Button */}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewProduct(product.slug)}
                          title="View product"
                          className="h-8 w-8"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteConfirm(product.id)}
                          disabled={loadingId === product.id}
                          title="Delete product"
                          className="h-8 w-8"
                        >
                          {loadingId === product.id ? (
                            <Loader2 className="h-3 w-3 animate-spin text-red-600" />
                          ) : (
                            <Trash2 size={16} className="text-red-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total Count */}
        <div className="pt-4 mt-4 border-t font-semibold text-gray-900">
          Total Products: {products?.length || 0}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setProductToDelete(null);
                }}
                disabled={loadingId === productToDelete}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loadingId === productToDelete}
              >
                {loadingId === productToDelete ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}