const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-[#E5E7EB] rounded-xl animate-pulse ${className ?? ''}`} />
)

export default function DashboardLoading() {
    return (
        <div className="flex gap-6 items-start">
            {/* Left column */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-9 w-28 rounded-xl" />
                </div>

                {/* Communicator cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                </div>

                {/* Charts */}
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-[220px] rounded-2xl" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-[200px] rounded-2xl" />
                        <Skeleton className="h-[200px] rounded-2xl" />
                    </div>
                    <Skeleton className="h-[120px] rounded-2xl" />
                </div>
            </div>

            {/* Right column — feed */}
            <div className="w-80 flex-shrink-0">
                <Skeleton className="h-[500px] rounded-2xl" />
            </div>
        </div>
    )
}
