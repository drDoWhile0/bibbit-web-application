'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ButtonTile from '@/components/board/ButtonTile'
import AcknowledgmentBanner from '@/components/board/AcknowledgementBanner'

interface Button {
  id: string
  label: string
  image_url?: string
  category: 'feeling' | 'need'
  color: string
  position: number
  tts_text?: string
}

interface Board {
  id: string
  buttons: Button[]
}

type AckType = 'on_my_way' | 'give_me_a_moment' | 'i_hear_you'

export default function BoardPage() {
  const { communicatorId } = useParams<{ communicatorId: string }>()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeAck, setActiveAck] = useState<AckType | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data, error } = await supabase
        .from('button_boards')
        .select('id, buttons(*)')
        .eq('communicator_id', communicatorId)
        .eq('is_active', true)
        .single()

      if (data) setBoard(data)
      setLoading(false)
    }

    init()

    // Realtime subscription for acknowledgments
    const channel = supabase
        .channel(`ack:${communicatorId}`)
        .on(
            'postgres_changes',
            {
            event: 'UPDATE',
            schema: 'public',
            table: 'events',
            },
            (payload) => {
            if (payload.new.communicator_id !== communicatorId) return
            const ackType = payload.new.acknowledgment_type as AckType | null
            if (ackType) setActiveAck(ackType)
            }
        )
        .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [communicatorId])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8]">
      <p className="text-sm text-[#9CA3AF]">Loading...</p>
    </div>
  )

  if (!board) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8]">
      <p className="text-sm text-[#9CA3AF]">No active board found.</p>
    </div>
  )

  const buttons = [...(board.buttons ?? [])].sort((a, b) => a.position - b.position)

  return (
    <div className="min-h-screen bg-[#F5F0E8] p-4">
      {activeAck && (
        <AcknowledgmentBanner
          acknowledgmentType={activeAck}
          onDismiss={() => setActiveAck(null)}
        />
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {buttons.map((btn) => (
          <ButtonTile key={btn.id} btn={btn} communicatorId={communicatorId} />
        ))}
      </div>
    </div>
  )
}