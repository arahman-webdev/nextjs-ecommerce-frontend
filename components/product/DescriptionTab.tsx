import { CheckCircle, Award, Leaf, Factory } from 'lucide-react';

interface DescriptionTabProps {
  product: any;
}

export default function DescriptionTab({ product }: DescriptionTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            {product.description || 'Elevate your living space with this premium furniture piece. Expertly crafted with attention to detail, this item combines modern aesthetics with unparalleled comfort.'}
          </p>
          <p>
            Designed for both style and functionality, this furniture piece features sustainable materials and superior craftsmanship that ensures lasting durability and timeless appeal.
          </p>

          <h4 className="text-lg lg:text-xl font-bold text-gray-900 mt-6 lg:mt-8 mb-4">Key Features:</h4>
          <ul className="space-y-3">
            {[
              'Premium sustainable materials for eco-friendly living',
              'Ergonomic design for optimal comfort and support',
              'Easy assembly with included tools and instructions',
              'Sturdy construction with weight capacity of 300lbs',
              'Easy-to-clean and maintain surface',
              'Versatile design complements any interior style'
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" style={{ color: '#83B734' }} />
                <span className="text-sm lg:text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 lg:mt-0">
        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-6 lg:p-8">
          <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Designer Notes</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Award className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Award-Winning Design</h5>
                <p className="text-gray-600 text-sm">Recognized for innovative design and sustainability</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Leaf className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Eco-Friendly</h5>
                <p className="text-gray-600 text-sm">Made with 100% sustainable and recycled materials</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Factory className="h-5 w-5 lg:h-6 lg:w-6 text-primary mt-1 flex-shrink-0" style={{ color: '#83B734' }} />
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Ethical Manufacturing</h5>
                <p className="text-gray-600 text-sm">Crafted in facilities with fair labor practices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}