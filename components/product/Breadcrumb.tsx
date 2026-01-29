import Link from 'next/link';

interface BreadcrumbProps {
  productName: string;
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <div className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-primary transition-colors">Home</Link> /{' '}
      <Link href="/furniture" className="hover:text-primary transition-colors">Furniture</Link> /{' '}
      <span className="text-black font-medium">{productName}</span>
    </div>
  );
}