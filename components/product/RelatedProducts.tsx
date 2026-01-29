import Image from 'next/image';
import Link from 'next/link';
import { Star, Package } from 'lucide-react';
import { AddToCart } from '@/components/SharedComponent/AddToCart';
import { formatPrice } from '@/lib/utils';

interface RelatedProductsProps {
  products: any[];
  currentProductId: string;
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Filter out current product from related products
  const filteredProducts = products.filter(p => p.id !== currentProductId);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="mt-12 lg:mt-20">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">You May Also Like</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
          Discover more premium furniture pieces that complement your style and elevate your space
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-xl lg:rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                {product.productImages.length > 0 ? (
                  <Image
                    src={product.productImages[0].imageUrl || '/api/placeholder/300/300'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <Package className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300" />
                  </div>
                )}

                {product.isFeatured && (
                  <div className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-primary text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#83B734' }}>
                    NEW
                  </div>
                )}
              </div>

              <div className="p-4 lg:p-5">
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <span className="text-xs lg:text-sm font-medium text-gray-600">
                    {product.category?.name || 'Furniture'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 lg:h-4 lg:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs lg:text-sm text-gray-600">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 lg:mb-3 text-sm lg:text-base group-hover:text-primary transition-colors" style={{ color: '#83B734' }}>
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-lg lg:text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <AddToCart
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      productImages: product.productImages,
                      stock: product.stock
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}