'use client'

import { useEffect } from 'react'

export default function DashboardError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string }
    unstable_retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 max-w-md shadow-sm">
                <p className="text-2xl mb-2">⚠️</p>
                <h2 className="text-lg font-bold text-[#2D4A3E] mb-2">Something went wrong</h2>
                <p className="text-sm text-[#6B7280] mb-6">
                    The dashboard failed to load. This is usually a temporary issue.
                </p>
                <button
                    onClick={unstable_retry}
                    className="px-5 py-2 bg-[#4A7C59] text-white text-sm font-medium rounded-xl hover:bg-[#3D6B4A] transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
