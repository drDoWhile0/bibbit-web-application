'use client'

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import CommunicatorCard from "@/components/dashboard/CommunicatorCard"
import DragGrid from "@/components/board/DragGrid"
import ButtonForm from "@/components/board/ButtonForm"
import { getOrCreateBoard } from "../communicators/[id]/actions"
import { Plus, ExternalLink } from "lucide-react"

interface Communicator {
    id: string
    name: string
    image_url?: string
    avatar_url: string | undefined
}

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
    name: string
    buttons: Button[]
}

export default function BoardEditorPage() {
    const [communicators, setCommunicators] = useState<Communicator[]>([])
    const [selectedCommunicator, setSelectedCommunicator] = useState<Communicator | null>(null)
    const [board, setBoard] = useState<Board | null>(null)
    const [buttons, setButtons] = useState<Button[]>([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [boardLoading, setBoardLoading] = useState(false)

    useEffect(() => {
        const fetchCommunicators = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('caregiver_communicator')
                .select('communicator_id, communicators(id, name, avatar_url)')
                .eq('caregiver_id', user.id)

            if (data) {
                const mapped = data.map((row: any) => row.communicators).filter(Boolean)
                setCommunicators(mapped)
            }
            setLoading(false)
        }

        fetchCommunicators()
    }, [])

    useEffect(() => {
        if (!selectedCommunicator) return

        const loadBoard = async () => {
            setBoardLoading(true)

            const data = await getOrCreateBoard(selectedCommunicator.id)
            setBoard(data)
            setButtons(data.buttons ?? [])
            setBoardLoading(false)
        }

        loadBoard()
    }, [selectedCommunicator])

    const handleButtonCreated = (newButton: Button) => {
        setButtons((prev) => [...prev, newButton])
        setShowForm(false)
    }

    return (
    <div className="flex gap-6 items-start">
      {/* Left column — communicator picker */}
      <div className="w-64 flex-shrink-0">
        <h2 className="text-lg font-bold text-[#2D4A3E] mb-6">Board Editor</h2>
        {loading ? (
          <p className="text-sm text-[#9CA3AF]">Loading...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {communicators.map((c) => (
              <CommunicatorCard
                key={c.id}
                name={c.name}
                avatarUrl={c.avatar_url}
                isSelected={selectedCommunicator?.id === c.id}
                onClick={() => setSelectedCommunicator(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right column — board */}
      <div className="flex-1 min-w-0">
        {!selectedCommunicator ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] flex items-center justify-center min-h-[400px]">
            <p className="text-xs text-[#D1D5DB]">Select a communicator to edit their board</p>
          </div>
        ) : boardLoading ? (
          <p className="text-sm text-[#9CA3AF]">Loading board...</p>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-[#2D4A3E]">
                    {selectedCommunicator.name}'s Board
                </h3>
                <div className="flex items-center gap-2">
                    
                    <a 
                        href={`/board/${selectedCommunicator.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-[#4A7C59] text-sm font-medium rounded-xl hover:bg-[#F0F7F3] transition-colors"
                    >
                    <ExternalLink size={16} />
                        View Board
                    </a>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-sm font-medium rounded-xl hover:bg-[#3D6B4A] transition-colors"
                    >
                    <Plus size={16} />
                        Add Button
                    </button>
                </div>
            </div>

            <DragGrid
              buttons={buttons}
              onReorder={setButtons}
            />

            {showForm && board && (
              <ButtonForm
                boardId={board.id}
                currentButtonCount={buttons.length}
                onCreated={handleButtonCreated}
                onClose={() => setShowForm(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}