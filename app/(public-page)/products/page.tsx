export const dynamic = 'force-dynamic';


import ProductsPage from '@/components/Public/ExploreProducts';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "LocalGuide's Curated Travel Experiences | Brows All Tours LocalGuide",
  description: "Explore thousands of handpicked tours worldwide. Filter by destination, category, duration, and price. Find your perfect local experience.",
};


export default function ProductPage() {
  return (
    <div className=''>
        <ProductsPage />
    </div>
  )
}