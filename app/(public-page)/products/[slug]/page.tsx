'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import { CartContext } from '@/app/context/CartContext';
import { toast } from 'sonner';
import axios from 'axios';
import { Product } from '@/types/order';
import PageLoading from '@/components/SharedComponent/loadings/PageLoading';
import ProductNotFound from '@/components/product/ProductNotFound';
import Breadcrumb from '@/components/product/Breadcrumb';
import ProductImagesSection from '@/components/product/ProductImagesSection';
import ProductInfoSection from '@/components/product/ProductInfoSection';
import ProductDetailsTabs from '@/components/product/ProductDetailsTabs';
import RelatedProducts from '@/components/product/RelatedProducts';
import { useAuth } from '@/app/context/AuthContext';


export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const cartContext = useContext(CartContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const {user} = useAuth()
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`
      );

      if (response.data.success) {
        const productData = response.data.data;
        setProduct(productData);
        fetchReviews(productData.id);
        fetchRelatedProducts(productData.category?.name);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/review/${productId}`
      );
      if (response.data.success) {
        setReviews(response.data.data);
      }
      console.log("from detail page for review", response.data.data)
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };



  const fetchRelatedProducts = async (categoryName?: string) => {
    if (!categoryName) return;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product?category=${encodeURIComponent(categoryName)}`
      );
      if (response.data.success) {
        setRelatedProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  if (isLoading) {
    return <PageLoading message='product' />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <Breadcrumb productName={product.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <ProductImagesSection 
            product={product}
            images={product.productImages}
          />
          
          <ProductInfoSection
            product={product}
            reviews={reviews}
            onAddToWishlist={() => {}}
          />
        </div>

        <ProductDetailsTabs 
          product={product}
          reviews={reviews}
          user={user}
        />

        {relatedProducts.length > 0 && (
          <RelatedProducts 
            products={relatedProducts}
            currentProductId={product.id}
          />
        )}
      </div>
    </div>
  );
}