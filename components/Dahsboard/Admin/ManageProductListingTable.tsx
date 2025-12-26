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
import { Eye, Trash2, Loader2 } from "lucide-react";
import { IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageProductListingTable({ products }: { products: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setproductToDelete] = useState<string | null>(null);

  // Get token from localStorage
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  // Debug: Check if token exists
  const debugAuth = () => {
    console.log('=== DEBUG AUTH ===');
    console.log('localStorage token:', localStorage.getItem('accessToken'));
    console.log('localStorage userRole:', localStorage.getItem('userRole'));
    console.log('sessionStorage token:', sessionStorage.getItem('token'));
    console.log('Current URL:', window.location.href);
  };

  // Update product status
  const updateStatus = async (id: string) => {
    try {
      setLoadingId(id);

      // Get token
      const token = getToken();
      
      console.log('Updating product status - Token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        debugAuth();
        toast.error("Please login again");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/toggle-status/${id}`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log('Status update response status:', res.status);

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
        toast.success(data.message || "Status updated");
        router.refresh();
      } else {
        toast.error(data.message || "Update failed");
      }

    } catch (error: any) {
      console.error("Status Update Error:", error);
      toast.error(error.message || "Failed to update");
    } finally {
      setLoadingId(null);
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (id: string) => {
    setproductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoadingId(productToDelete);

      // Get token
      const token = getToken();
      
      console.log('Deleting product - Token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        debugAuth();
        toast.error("Please login again");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${productToDelete}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete response status:', res.status);

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
      console.log('Delete success:', data);

      if (data.success) {
        toast.success(data.message || "product deleted");
        router.refresh();
      } else {
        toast.error(data.message || "Delete failed");
      }

    } catch (error: any) {
      console.error("Delete Error:", error);
      toast.error(error.message || "Failed to delete");
    } finally {
      setLoadingId(null);
      setDeleteConfirmOpen(false);
      setproductToDelete(null);
    }
  };

  // View product details
  const viewproduct = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6 flex gap-1.5 items-center">
        <IconUsers size={30} /> Manage product Listings
      </h1>

      <div className="bg-white shadow-md rounded-xl p-8 border border-blue-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="font-semibold text-blue-700">product</TableHead>
              <TableHead className="font-semibold text-blue-700">Seller</TableHead>
              <TableHead className="font-semibold text-blue-700">Price</TableHead>
              <TableHead className="font-semibold text-blue-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-blue-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products?.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-blue-50/50 transition"
              >
                {/* product Info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.productImages?.[0]?.imageUrl || "/default-product.jpg"}
                      alt={product.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium text-blue-900">
                        {product.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Guide */}
                <TableCell>
                  <div className="font-medium">
                    {product?.user?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {product?.user?.email || ""}
                  </div>
                </TableCell>

                {/* Fee */}
                <TableCell>${product.price}</TableCell>

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
                <TableCell className="text-right space-x-3">
                  {/* Activate / Deactivate */}
                  <Button
                    onClick={() => updateStatus(product.id)}
                    disabled={loadingId === product.id}
                    variant={product.isActive ? "outline" : "default"}
                    size="sm"
                    className={`min-w-[120px] gap-2 transition-all duration-300 ${product.isActive
                      ? "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                  >
                    {loadingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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
                    onClick={() => viewproduct(product.slug)}
                    title="View product"
                  >
                    <Eye size={19} className="text-blue-600" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteConfirm(product.id)}
                    disabled={loadingId === product.id}
                    title="Delete product"
                  >
                    {loadingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 size={19} className="text-red-600" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Count */}
        <div className="pt-4 font-semibold text-blue-800">
          Total products: {products?.length || 0}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
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
                  setproductToDelete(null);
                }}
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

      {/* Debug button (remove in production) */}
      <button 
        onClick={debugAuth}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs opacity-50 hover:opacity-100"
      >
        Debug Auth
      </button>
    </div>
  );
}