import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DescriptionTab from './DescriptionTab';
import SpecificationsTab from './SpecificationsTab';
import ReviewsTab from './ReviewsTab';
import ShippingTab from './ShippingTab';
import { useState } from 'react';


interface ProductDetailsTabsProps {
  product: any;
  reviews: any[];
  user: any
}



export default function ProductDetailsTabs({ product, reviews, user }: ProductDetailsTabsProps) {
  return (
    <div className="mt-12 lg:mt-16">
      <Tabs  defaultValue="description" className="w-full">
        <div className="border-b">
          <TabsList className="w-full bg-transparent h-12 lg:h-14 overflow-x-auto">
            <TabsTrigger
              value="description"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
              style={{ borderColor: '#83B734' }}
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
              style={{ borderColor: '#83B734' }}
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
              style={{ borderColor: '#83B734' }}
            >
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:border-b-2 data-[state=active]:text-primary px-4 lg:px-6 py-3 text-sm lg:text-lg"
              style={{ borderColor: '#83B734' }}
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="py-6 lg:py-8">
          <TabsContent value="description" className="mt-0">
            <DescriptionTab product={product} />
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-0">
            <SpecificationsTab product={product} />
          </TabsContent>
          
          <TabsContent id='reviews' value="reviews" className="mt-0">
            <ReviewsTab  product={product} reviews={reviews} user={user} />
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-0">
            <ShippingTab product={product} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}