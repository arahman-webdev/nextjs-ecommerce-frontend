import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link href="/products">
          <Button className="bg-primary hover:bg-primary/90" style={{ backgroundColor: '#83B734' }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}