'use client'

import { useEffect, useState } from "react"
import { fetchEventsForInsights } from "@/app/dashboard/actions"
import { generateInsights } from "@/lib/insights"
import { Sparkle } from "lucide-react"

interface Props {
    communicatorId: string
    communicatorName: string
    days: 7 | 30 | 90
}

export default function InsightsSummary({ communicatorId, communicatorName, days }: Props) {
    const [insights, setInsights] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const events = await fetchEventsForInsights(communicatorId, days)
            const generated = generateInsights({ events, communicatorName, days })
            console.log('events for insights:', events.length)
            console.log('generated insights:', generated)
            setInsights(generated)
            setLoading(false)
        }
        load()
    }, [communicatorId, communicatorName, days])

    if (loading) return null

    if (insights.length === 0) {
        return (
            <div className='bg-white rounded-2xl border border-dashed border-[#E5E7EB] px-5 py-4'>
                <p className='text-xs text-[#D1D5DB] text-center'>
                    Not enough data yet to generate insights. Encourage your communicator to continue using the board!
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
        <div className="flex items-center gap-2 mb-4">
            <Sparkle size={14} className="text-[#4A7C59]" />
            <p className="text-sm font-semibold text-[#2D4A3E]">Insights</p>
            <span className="text-xs text-[#9CA3AF] ml-1">— last {days} days</span>
        </div>

        <div className="flex flex-col gap-3">
            {insights.map((insight, index) => (
            <div key={index} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-[#F0F7F3] text-[#4A7C59] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
                </span>
                <p className="text-sm text-[#4B5563] leading-relaxed">{insight}</p>
            </div>
            ))}
        </div>
        </div>
    )
}