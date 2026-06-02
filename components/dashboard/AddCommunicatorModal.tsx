'use client'

import { useState } from "react"
import Image from 'next/image'
import { createClient } from "@/lib/supabase/client"
import { createCommunicator } from '@/app/dashboard/actions'

const avatarOptions = [
    { label: 'Red Default', src: '/assets/companions/red_default.png' },
    { label: 'Red Wave', src: '/assets/companions/red_wave.png' },
    { label: 'Red Cheer', src: '/assets/companions/red_cheer.png' },
    { label: 'Orange Default', src: '/assets/companions/orange_default.png' },
    { label: 'Orange Wave', src: '/assets/companions/orange_wave.png' },
    { label: 'Orange Cheer', src: '/assets/companions/orange_cheer.png' },
    { label: 'Yellow Default', src: '/assets/companions/yellow_default.png' },
    { label: 'Yellow Wave', src: '/assets/companions/yellow_wave.png' },
    { label: 'Yellow Cheer', src: '/assets/companions/yellow_cheer.png' },
    { label: 'Green Default', src: '/assets/companions/green_default.png' },
    { label: 'Green Wave', src: '/assets/companions/green_wave.png' },
    { label: 'Green Cheer', src: '/assets/companions/green_cheer.png' },
    { label: 'Blue Default', src: '/assets/companions/blue_default.png' },
    { label: 'Blue Wave', src: '/assets/companions/blue_wave.png' },
    { label: 'Blue Cheer', src: '/assets/companions/blue_cheer.png' },
    { label: 'Purple Default', src: '/assets/companions/lavender_default.png' },
    { label: 'Purple Wave', src: '/assets/companions/lavender_wave.png' },
    { label: 'Purple Cheer', src: '/assets/companions/lavender_cheer.png' },
    { label: 'Black Default', src: '/assets/companions/black_default.png' },
    { label: 'Black Wave', src: '/assets/companions/black_wave.png' },
    { label: 'Black Cheer', src: '/assets/companions/black_cheer.png' },
    { label: 'White Default', src: '/assets/companions/white_default.png' },
    { label: 'White Wave', src: '/assets/companions/white_wave.png' },
    { label: 'White Cheer', src: '/assets/companions/white_cheer.png' },
    { label: 'Rainbow Default', src: '/assets/companions/rainbow_default.png' },
    { label: 'Rainbow Wave', src: '/assets/companions/rainbow_wave.png' },
    { label: 'Rainbow Cheer', src: '/assets/companions/rainbow_cheer.png' },
]

interface Props {
    onClose: () => void
    onCreated: () => void
}

export default function AddCommunicatorModal({ onClose, onCreated }: Props) {
    const [name, setName] = useState('')
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].src)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Please enter a name.')
            return
        }

        setLoading(true)
        setError(null)
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setError('Not authenticated.')
            setLoading(false)
            return
        }

        try {
            await createCommunicator(user.id, name.trim(), selectedAvatar)
            onCreated()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-[#2D4A3E] mb-1">Add Communicator</h2>
            <p className="text-sm text-[#6B7280] mb-5">Create a profile for the person you support.</p>

            {/* Name input */}
            <div className="mb-5">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5 block">
                Name
            </label>
            <input
                type="text"
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59] placeholder:text-[#9CA3AF]"
            />
            </div>

            {/* Avatar picker */}
            <div className="mb-5">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2 block">
                Choose a Bibbit
            </label>
            <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map((avatar) => (
                <button
                    key={avatar.src}
                    onClick={() => setSelectedAvatar(avatar.src)}
                    className={`rounded-xl p-1 border-2 transition-all ${
                    selectedAvatar === avatar.src
                        ? 'border-[#4A7C59]'
                        : 'border-transparent hover:border-[#E5E7EB]'
                    }`}
                >
                    <Image
                    src={avatar.src}
                    alt={avatar.label}
                    width={48}
                    height={48}
                    className="rounded-lg"
                    />
                </button>
                ))}
            </div>
            </div>

            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-[#F5F0E8] transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#4A7C59] text-white text-sm font-semibold hover:bg-[#3D6B4A] transition-colors disabled:opacity-60"
            >
                {loading ? 'Creating...' : 'Create'}
            </button>
            </div>
        </div>
        </div>
    )
}