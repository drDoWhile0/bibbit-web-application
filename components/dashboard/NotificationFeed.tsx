'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Zap } from "lucide-react"

interface FeedEvent {
    id: string
    button_label: string
    button_category: 'feeling' | 'need'
    button_image_url?: string
    pressed_at: string
}

interface Props {
    communicatorId: string
    communicatorName: string
}

function timeLabel(iso: string) {
    const date = new Date(iso)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const CATEGORY_COLOR: Record<string, string> = {
    feeling: '#A78BFA',
    need: '#34D399'
}

export default function NotificationFeed({ communicatorId, communicatorName }: Props) {
    const [events, setEvents] = useState<FeedEvent[]>([])

    useEffect(() => {
        const supabase = createClient()

        async function fetchRecent() {
            const { data } = await supabase
                .from('events')
                .select('id, button_label, button_category, button_image_url, pressed_at')
                .eq('communicator_id', communicatorId)
                .order('pressed_at', { ascending: false })
                .limit(20)

            if(data) setEvents(data)
        }

        fetchRecent()

        const channel = supabase
            .channel(`events:${communicatorId}`)
            .on(
                'postgres_changes',
                {
                event: 'INSERT',
                schema: 'public',
                table: 'events',
                filter: `communicator_id=eq.${communicatorId}`,
                },
                (payload) => {
                console.log('realtime payload:', payload)
                const newEvent = payload.new as FeedEvent
                setEvents((prev) => [newEvent, ...prev].slice(0, 20))
                }
            )
            .subscribe((status) => {
                console.log('realtime status:', status)
            })

            return () => {
                supabase.removeChannel(channel)
            }
    }, [communicatorId])

    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] flex flex-col h-full min-h-[400px] mt-[60px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#4A7C59]" />
                <span className="text-sm font-semibold text-[#2D4A3E]">Live Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-[#9CA3AF]">LIVE</span>
            </div>
        </div>

        {/* Subheader */}
        <div className="px-4 py-2 border-b border-[#F3F4F6]">
            <p className="text-xs text-[#9CA3AF]">Real-time Feed — {communicatorName}</p>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
            {events.length === 0 ? (
            <p className="text-xs text-[#D1D5DB] text-center mt-8">No activity yet.</p>
        ) : (
            events.map((event, index) => (
                <div
                    key={event.id}
                    className="flex gap-3 items-start animate-fade-in">
                    {/* Dot + line */}
                    <div className="flex flex-col items-center pt-1">
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: CATEGORY_COLOR[event.button_category] }}
                        />
                        {index < events.length - 1 && (
                            <span className="w-px flex-1 bg-[#F3F4F6] mt-1" style={{ minHeight: 24 }} />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-0.5 pb-2">
                        <span className="text-xs text-[#9CA3AF]">{timeLabel(event.pressed_at)}</span>
                        <p className="text-sm text-[#2D4A3E]">
                        {event.button_image_url && (
                            <span className="mr-1">{event.button_image_url}</span>
                        )}
                            <span className="font-semibold">{communicatorName}</span>
                        {' '}
                        {event.button_category === 'feeling' ? 'is feeling' : 'needs'}
                        {' '}
                        <span
                            className="font-semibold"
                            style={{ color: CATEGORY_COLOR[event.button_category] }}
                        >
                            {event.button_label}
                        </span>
                        </p>
                    </div>
                </div>
            ))
        )}
        </div>
        </div>
    )
}