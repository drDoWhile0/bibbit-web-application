'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { acknowledgeEvent } from '@/app/dashboard/communicators/[id]/actions'
import { Zap } from 'lucide-react'

interface FeedEvent {
  id: string
  button_label: string
  button_category: 'feeling' | 'need'
  button_image_url?: string
  pressed_at: string
  acknowledgment_type?: 'on_my_way' | 'give_me_a_moment' | 'i_hear_you'
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
  need: '#34D399',
}

const ACKNOWLEDGMENTS: { label: string; value: 'on_my_way' | 'give_me_a_moment' | 'i_hear_you' }[] = [
  { label: 'I hear you 💙', value: 'i_hear_you' },
  { label: 'On my way 🏃', value: 'on_my_way' },
  { label: 'Give me a moment ⏳', value: 'give_me_a_moment' },
]

export default function NotificationFeed({ communicatorId, communicatorName }: Props) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const { data } = await supabase
        .from('events')
        .select('id, button_label, button_category, button_image_url, pressed_at, acknowledgment_type')
        .eq('communicator_id', communicatorId)
        .order('pressed_at', { ascending: false })
        .limit(20)

      if (data) setEvents(data)
    }

    init()

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
          const newEvent = payload.new as FeedEvent
          setEvents((prev) => [newEvent, ...prev].slice(0, 20))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [communicatorId])

  const handleAcknowledge = async (
    eventId: string,
    type: 'on_my_way' | 'give_me_a_moment' | 'i_hear_you'
  ) => {
    if (!userId) return

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, acknowledgment_type: type } : e))
    )

    await acknowledgeEvent(eventId, userId, type)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] flex flex-col h-full min-h-[400px]">
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
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center">
              <Zap size={18} className="text-[#D1D5DB]" />
            </div>
            <p className="text-sm font-medium text-[#9CA3AF]">No activity yet</p>
            <p className="text-xs text-[#D1D5DB] max-w-[180px]">
              Button presses will appear here in real time
            </p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id}
              className="flex gap-3 items-start cursor-pointer"
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
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
              <div className="flex flex-col gap-1.5 pb-2 flex-1">
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

                {/* Acknowledgment */}
                {event.acknowledgment_type ? (
                  <span className="text-xs text-[#9CA3AF] italic">
                    {ACKNOWLEDGMENTS.find((a) => a.value === event.acknowledgment_type)?.label}
                  </span>
                ) : hoveredId === event.id ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {ACKNOWLEDGMENTS.map((ack) => (
                      <button
                        key={ack.value}
                        onClick={() => handleAcknowledge(event.id, ack.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-[#E5E7EB] text-[#4A7C59] hover:bg-[#F0F7F3] transition-colors"
                      >
                        {ack.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}