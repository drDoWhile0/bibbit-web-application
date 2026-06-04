'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getOrCreateBoard } from '../actions'
import ButtonForm from '@/components/board/ButtonForm'
import { Plus } from 'lucide-react'
import DragGrid from '@/components/board/DragGrid'

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
  const { id: communicatorId } = useParams<{ id: string }>()
  const [board, setBoard] = useState<Board | null>(null)
  const [buttons, setButtons] = useState<Button[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getOrCreateBoard(communicatorId)
      setBoard(data)
      setButtons(data.buttons ?? [])
      setLoading(false)
    }
    load()
  }, [communicatorId])
  
  const handleButtonCreated = (newButton: Button) => {
    setButtons((prev) => [...prev, newButton])
    setShowForm(false)
  }

  if (loading) return <p className="text-sm text-[#9CA3AF]">Loading board...</p>
  if (!board) return <p className="text-sm text-red-400">Board not found.</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#2D4A3E]">Board Editor</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white text-sm font-medium rounded-xl hover:bg-[#3D6B4A] transition-colors"
        >
          <Plus size={16} />
          Add Button
        </button>
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
  )
}