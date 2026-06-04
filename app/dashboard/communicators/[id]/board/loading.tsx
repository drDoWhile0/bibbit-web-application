const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-[#E5E7EB] rounded-xl animate-pulse ${className ?? ''}`} />
)

export default function BoardEditorLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
            </div>
        </div>
    )
}
