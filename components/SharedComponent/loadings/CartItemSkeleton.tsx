import { cn } from '@/lib/utils'


export default function CartItemSkeleton() {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={cn(
                        "bg-white rounded-xl shadow overflow-hidden animate-pulse",

                    )}>
                        <div className={cn(
                            "bg-gray-300",
                            "h-56"
                        )} />
                        <div className="p-4 flex-1">
                            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-16 bg-gray-300 rounded w-full mb-3"></div>
                            <div className="h-6 bg-gray-300 rounded w-full"></div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}
