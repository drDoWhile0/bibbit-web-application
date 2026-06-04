'use client'

import { useEffect, useState } from "react"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { fetchCategorySplit } from "@/app/dashboard/actions"

interface Props {
    communicatorId: string
    communicatorName: string
    days: 7 | 30 | 90
}

const COLORS = {
    feeling: '#A78BFA',
    need: '#34D399'
}

export default function CategoryDonutChart({ communicatorId, communicatorName, days }: Props) {
    const [data, setData] = useState<{ feeling: number; need: number; total: number } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const result = await fetchCategorySplit(communicatorId, days)
            setData(result)
            setLoading(false)
        }
        load()
    }, [communicatorId, days])

    const chartData = data
        ? [
            { name: 'Feelings', value: data.feeling },
            { name: 'Needs', value: data.need },
          ]
        : []

    const isEmpty = !data || data.total === 0

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
            {/* Header */}
            <div className="mb-5">
                <p className="text-sm font-semibold text-[#2D4A3E]">Feelings vs Needs</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{communicatorName}</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <p className="text-xs text-[#9CA3AF]">Loading...</p>
                </div>
            ) : isEmpty ? (
                <div className="flex items-center justify-center h-48">
                    <p className="text-xs text-[#D1D5DB]">No activity in this period.</p>
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    {/* Donut */}
                    <ResponsiveContainer width="50%" height={180}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={75}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={index === 0 ? COLORS.feeling : COLORS.need}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '12px',
                                    color: '#2D4A3E',
                                }}
                                formatter={(value: any) => [value, 'presses']}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend + percentages */}
                    <div className="flex flex-col gap-3">
                        {chartData.map((entry, index) => {
                            const pct = data ? Math.round((entry.value / data.total) * 100) : 0
                            return (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: index === 0 ? COLORS.feeling : COLORS.need }}
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-[#2D4A3E]">{entry.name}</p>
                                        <p className="text-xs text-[#9CA3AF]">{pct}% · {entry.value} presses</p>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="mt-1 pt-2 border-t border-[#F3F4F6]">
                            <p className="text-xs text-[#9CA3AF]">Total: <span className="font-semibold text-[#2D4A3E]">{data?.total}</span> presses</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}