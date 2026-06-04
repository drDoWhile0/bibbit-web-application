'use client'

import { useEffect, useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { fetchEventFrequency } from "@/app/dashboard/actions"

interface DataPoint {
    date: string
    count: number
}

interface Props {
    communicatorId: string
    communicatorName: string
}

const RANGES: { label: string; value: 7 | 30 | 90 }[] = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 }
]

function formatDate(dateStr: string, days: number) {
    const date = new Date(dateStr)
    if (days === 7) {
        return date.toLocaleDateString([], { weekday: 'short' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function FrequencyLineChart({ communicatorId, communicatorName }: Props) {
    const [data, setData] = useState<DataPoint[]>([])
    const [days, setDays] = useState<7 | 30 | 90>(7)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const result = await fetchEventFrequency(communicatorId, days)
            setData(result)
            setLoading(false)
        }
        load()
    }, [communicatorId, days])

    const isEmpty = data.reduce((sum, d) => sum + d.count, 0) === 0
    const formatted = data.map((d) => ({ ...d, label: formatDate(d.date, days) }))

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-sm font-semibold text-[#2D4A3E]">Button Press Frequency</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{communicatorName}</p>
                </div>
                <div className="flex rounded-xl overflow-hidden border border-[#E5E7EB]">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setDays(r.value)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                days === r.value
                                ? 'bg-[#4A7C59] text-white'
                                : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <p className="text-xs text-[#9CA3AF]">Loading...</p>
                </div>
            ) : isEmpty ? (
                <div className="flex items-center justify-center h-48">
                    <p className="text-xs text-[#D1D5DB]">No activity in this period.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={formatted} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
                            tickLine={false}
                            axisLine={false}
                            interval={days === 7 ? 0 : days === 30 ? 4 : 13}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#9CA3AF' }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                fontSize: '12px',
                                color: '#2D4A3E',
                            }}
                            formatter={(value: any) => [value ?? 0, 'Presses']}
                            labelFormatter={(label) => label}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#4A7C59"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#4A7C59', strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: '#4A7C59' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}