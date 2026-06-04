const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-[#D1D5DB] rounded-2xl animate-pulse ${className ?? ''}`} />
)

export default function BoardLoading() {
    return (
        <div className="min-h-screen bg-[#F5F0E8] p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                ))}
            </div>
        </div>
    )
}
