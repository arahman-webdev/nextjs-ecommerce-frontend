import { CheckCircle, XCircle, Clock, RefreshCw, Package, ArrowUpRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config: Record<string, { color: string; icon: LucideIcon }> = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
        SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Package },
        DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
        REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: ArrowUpRight },
        FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const { color, icon: Icon } = config[status] || config.PENDING;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
    );
}