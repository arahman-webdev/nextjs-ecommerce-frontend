import {
  Ruler,
  Weight,
  Palette,
  CheckSquare,
  Shield,
  Package2,
  Truck,
  RefreshCw,
  Clock
} from 'lucide-react';

interface SpecificationsTabProps {
  product: any;
}

export default function SpecificationsTab({ product }: SpecificationsTabProps) {
  const specifications = [
    { icon: Ruler, label: 'Dimensions', value: `${product.width || 24}" W × ${28}" D × ${product.height || 33}" H` },
    { icon: Weight, label: 'Weight', value: `${product.weight || 15} kg` },
    { icon: Palette, label: 'Colors Available', value: '4 Colors' },
    { icon: CheckSquare, label: 'Assembly Required', value: 'Yes (20-30 mins)' },
    { icon: Shield, label: 'Warranty', value: '2 Years' },
    { icon: Package2, label: 'Package Weight', value: '18 kg' },
    { icon: Truck, label: 'Shipping Dimensions', value: '26" × 30" × 35"' },
    { icon: RefreshCw, label: 'Return Period', value: '30 Days' },
    { icon: Clock, label: 'Delivery Time', value: '3-5 Business Days' },
  ];

  return (
    <>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Technical Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {specifications.map((spec, index) => (
          <div key={index} className="border rounded-lg lg:rounded-xl p-4 lg:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2 lg:mb-3">
              <div className="p-2 bg-primary/10 rounded-lg" style={{ backgroundColor: '#83B7341A' }}>
                <spec.icon className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: '#83B734' }} />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{spec.label}</h4>
            </div>
            <p className="text-gray-700 text-sm lg:text-base">{spec.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}