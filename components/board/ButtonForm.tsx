'use client'

import { useState } from "react"
import { createButton } from "@/app/dashboard/communicators/[id]/actions"
import { X } from 'lucide-react'

const SWATCHES = [
    { label: 'Coral', value: '#F87171' },
    { label: 'Orange', value: '#FB923C' },
    { label: 'Yellow', value: '#FBBF24' },
    { label: 'Mint', value: '#34D399' },
    { label: 'Sky', value: '#38DBF8' },
    { label: 'Lavender', value: '#A78BFA' },
    { label: 'Pink', value: '#F472B6' },
    { label: 'Sage', value: '#4A7C59' },
    { label: 'Slate', value: '#94A3B8' },
    { label: 'Peach', value: '#FDBA74' },
]

interface Props {
    boardId: string
    currentButtonCount: number
    onCreated: (button: any) => void
    onClose: () => void
}

export default function ButtonForm({ boardId, currentButtonCount, onCreated, onClose }: Props) {
    const [label, setLabel] = useState('')
    const [emoji, setEmoji] = useState('')
    const [category, setCategory] = useState<'feeling' | 'need'>('feeling')
    const [color, setColor] = useState(SWATCHES[0].value)
    const [ttsText, setTtsText] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    
    
    const handleSave = async () => {
        if (!label.trim()) {
            setError('Label is required.')
            return
        }

        setSaving(true)
        setError('')

        try {
            const newButton = await createButton(boardId, currentButtonCount, {
                label: label.trim(),
                category,
                color,
                image_url: emoji.trim() || undefined,
                tts_text: ttsText.trim() || undefined,
            })
            onCreated(newButton)
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong')
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#2D4A3E]">New Button</h3>
                    <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#2D4A3E] transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Label */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">Label <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Happy, Hungry, Tired"
                        className="border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
                    />
                </div>

                {/* Emoji */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">Emoji <span className="text-[#D1D5DB]">(optional)</span></label>
                    <input
                        type="text"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                        placeholder="e.g. 😊"
                        className="border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">Category</label>
                    <div className="flex rounded-xl overflow-hidden border border-[#E5E7EB]">
                        {(['feeling', 'need'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
                            category === cat
                                ? 'bg-[#4A7C59] text-white'
                                : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                            }`}
                        >
                            {cat}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-[#6B7280]">Color</label>
                    <div className="flex flex-wrap gap-2">
                        {SWATCHES.map((swatch) => (
                        <button
                            key={swatch.value}
                            onClick={() => setColor(swatch.value)}
                            title={swatch.label}
                            className={`w-8 h-8 rounded-full transition-transform ${
                            color === swatch.value ? 'ring-2 ring-offset-2 ring-[#2D4A3E] scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: swatch.value }}
                        />
                        ))}
                    </div>
                </div>

                {/* TTS Override */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">TTS Override <span className="text-[#D1D5DB]">(optional)</span></label>
                    <input
                        type="text"
                        value={ttsText}
                        onChange={(e) => setTtsText(e.target.value)}
                        placeholder="Custom spoken text"
                        className="border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#2D4A3E] placeholder:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
                    />
                </div>

                {/* Preview */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">Preview</label>
                    <div className="flex items-center justify-center">
                        <div
                        className="flex flex-col items-center justify-center rounded-2xl p-4 text-white text-sm font-medium text-center shadow-sm w-24 h-24"
                        style={{ backgroundColor: color }}
                        >
                        {emoji && <span className="text-3xl mb-1">{emoji}</span>}
                        <span>{label || 'Label'}</span>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && <p className="text-xs text-red-400">{error}</p>}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2 rounded-xl bg-[#4A7C59] text-white text-sm font-medium hover:bg-[#3D6B4A] transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Button'}
                    </button>
                </div>

            </div>
        </div>
    )
}
