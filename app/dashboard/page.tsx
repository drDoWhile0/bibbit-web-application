'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import CommunicatorCard from "@/components/dashboard/CommunicatorCard"
import AddCommunicatorModal from "@/components/dashboard/AddCommunicatorModal"
import NotificationFeed from "@/components/dashboard/NotificationFeed"
import { Plus } from 'lucide-react'
import FrequencyLineChart from "@/components/dashboard/FrequencyLineChart"
import DayOfWeekBarChart from "@/components/dashboard/DayOfWeekBarChart"
import CategoryDonutChart from "@/components/dashboard/CategoryDonutChart"
import InsightsSummary from "@/components/dashboard/InsightsSummary"

interface Communicator {
    id: string
    name: string
    avatar_url: string
}

export default function DashboardPage() {
    const [communicators, setCommunicators] = useState<Communicator[]>([])
    const [selectedCommunicator, setSelectedCommunicator] = useState<Communicator | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState<7 | 30 | 90>(7)

    const fetchCommunicators = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('caregiver_communicator')
            .select('communicator_id, communicators(id, name, avatar_url)')
            .eq('caregiver_id', user.id)

        if (data) {
            const mapped = data
                .map((row: any) => row.communicators)
                .filter(Boolean)
            setCommunicators(mapped)
            if (mapped.length > 0) setSelectedCommunicator(mapped[0])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCommunicators()
    }, [])

    return (
        <div className="flex gap-6 items-start">
            {/* Left column */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#2D4A3E]">Active Communicators</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-sm font-medium rounded-xl hover:bg-[#3D6B4A] transition-colors"
                    >
                        <Plus size={16} />
                        Add New
                    </button>
                </div>

                {loading ? (
                    <p className="text-sm text-[#9CA3AF]">Loading...</p>
                ) : communicators.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#E5E7EB]">
                        <p className="text-[#9CA3AF] text-sm mb-3">No communicators yet.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-[#4A7C59] text-sm font-medium hover:underline"
                        >
                            Add your first communicator →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {communicators.map((c) => (
                            <CommunicatorCard
                                key={c.id}
                                name={c.name}
                                avatarUrl={c.avatar_url}
                                isSelected={selectedCommunicator?.id === c.id}
                                onClick={() => {
                                    console.log('clicked:', c.id, c.name)
                                    setSelectedCommunicator(c)
                                }}
                            />
                        ))}
                    </div>
                )}

                {selectedCommunicator && (
                    <div className="mt-6 flex flex-col gap-4">
                        <FrequencyLineChart
                            key={`line-${selectedCommunicator.id}-${days}`}
                            communicatorId={selectedCommunicator.id}
                            communicatorName={selectedCommunicator.name}
                            days={days}
                            onDaysChange={setDays}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <CategoryDonutChart
                                key={`donut-${selectedCommunicator.id}-${days}`}
                                communicatorId={selectedCommunicator.id}
                                communicatorName={selectedCommunicator.name}
                                days={days}
                            />
                            <DayOfWeekBarChart
                                key={`bar-${selectedCommunicator.id}`}
                                communicatorId={selectedCommunicator.id}
                                communicatorName={selectedCommunicator.name}
                            />
                        </div>
                        <InsightsSummary
                            key={`insights-${selectedCommunicator.id}-${days}`}
                            communicatorId={selectedCommunicator.id}
                            communicatorName={selectedCommunicator.name}
                            days={days}
                        />
                    </div>
                )}

            </div>

            {/* Right column — feed */}
            <div className="w-80 flex-shrink-0">
                {selectedCommunicator ? (
                    <NotificationFeed
                        key={selectedCommunicator.id}
                        communicatorId={selectedCommunicator.id}
                        communicatorName={selectedCommunicator.name}
                    />
                ) : (
                    <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] flex items-center justify-center min-h-[400px]">
                        <p className="text-xs text-[#D1D5DB]">Select a communicator to view activity</p>
                    </div>
                )}
            </div>

            {showModal && (
                <AddCommunicatorModal
                    onClose={() => setShowModal(false)}
                    onCreated={fetchCommunicators}
                />
            )}
        </div>
    )
}