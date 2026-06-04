'use client'

import { useEffect, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { fetchDayOfWeekData } from "@/app/dashboard/actions"

interface DataPoint {
    day: string
    feeling: number
    need: number
}

interface Props {
    communicatorId: string
    communicatorName: string
}

export default function DayOfWeekBarChart({ communicatorId, communicatorName }: Props) {
    const [data, setData] = useState<DataPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const result = await fetchDayOfWeekData(communicatorId)
            setData(result)
            setLoading(false)
        }

        load()
    }, [communicatorId])

    const isEmpty = data.every((d) => d.feeling === 0 && d.need === 0)

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
        {/* Header */}
        <div className="mb-5">
            <p className="text-sm font-semibold text-[#2D4A3E]">Weekly Communication Patterns</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{communicatorName} — all time</p>
        </div>

        {loading ? (
            <div className="flex items-center justify-center h-48">
            <p className="text-xs text-[#9CA3AF]">Loading...</p>
            </div>
        ) : isEmpty ? (
            <div className="flex items-center justify-center h-48">
            <p className="text-xs text-[#D1D5DB]">No activity yet.</p>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
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
                cursor={{ fill: '#F5F0E8' }}
                />
                <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                    <span style={{ fontSize: 11, color: '#6B7280', textTransform: 'capitalize' }}>
                    {value}
                    </span>
                )}
                />
                <Bar dataKey="feeling" name="Feelings" stackId="a" fill="#A78BFA" radius={[0, 0, 0, 0]} />
                <Bar dataKey="need" name="Needs" stackId="a" fill="#34D399" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        )}
        </div>
    )
}