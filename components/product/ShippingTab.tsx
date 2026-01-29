import { Truck, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShippingTabProps {
  product: any;
}

export default function ShippingTab({ product }: ShippingTabProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Shipping Information</h3>
        <div className="space-y-6">
          <div className="border rounded-xl lg:rounded-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="p-2 lg:p-3 bg-primary/10 rounded-lg lg:rounded-xl flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                <Truck className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Standard Shipping</h4>
                <p className="text-gray-600">5-7 business days</p>
              </div>
              <div className="ml-0 sm:ml-auto">
                <p className="text-lg lg:text-xl font-bold text-primary" style={{ color: '#83B734' }}>
                  {product.price > 199 ? 'FREE' : '$14.99'}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm lg:text-base">
              Free standard shipping on all orders over $199. Orders placed before 2 PM EST ship same day.
            </p>
          </div>

          <div className="border rounded-xl lg:rounded-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="p-2 lg:p-3 bg-primary/10 rounded-lg lg:rounded-xl flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                <Clock className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Express Shipping</h4>
                <p className="text-gray-600">2-3 business days</p>
              </div>
              <div className="ml-0 sm:ml-auto">
                <p className="text-lg lg:text-xl font-bold text-gray-900">$24.99</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm lg:text-base">
              Get your order faster with expedited shipping. Available for in-stock items only.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 lg:mt-0">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Return Policy</h3>
        <div className="space-y-6">
          <div className="border rounded-xl lg:rounded-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="p-2 lg:p-3 bg-primary/10 rounded-lg lg:rounded-xl flex-shrink-0" style={{ backgroundColor: '#83B7341A' }}>
                <RefreshCw className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: '#83B734' }} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">30-Day Returns</h4>
                <p className="text-gray-600">Hassle-free returns</p>
              </div>
            </div>
            <div className="space-y-2 lg:space-y-3 text-gray-700 text-sm lg:text-base">
              <p>• Return within 30 days of delivery for a full refund</p>
              <p>• Item must be in original condition with all packaging</p>
              <p>• Free returns for damaged or defective items</p>
              <p>• Refunds processed within 3-5 business days</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl lg:rounded-2xl p-4 lg:p-6" style={{ backgroundColor: '#83B7340A', borderColor: '#83B73433' }}>
            <div className="flex items-start gap-3 lg:gap-4">
              <ShieldCheck className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Extended Warranty Available</h4>
                <p className="text-gray-700 mb-3 text-sm lg:text-base">
                  Extend your warranty to 5 years for additional peace of mind.
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 text-sm"
                  style={{ borderColor: '#83B734', color: '#83B734' }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}