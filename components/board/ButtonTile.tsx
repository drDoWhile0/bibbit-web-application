'use client'

import { useState } from "react"
import { logEvent } from "@/app/board/[communicatorId]/actions"
import { speak } from "@/lib/tts"

interface Button {
    id: string
    label: string
    image_url?: string
    tts_text?: string
    category: 'feeling' | 'need'
    color: string
}

interface Props {
    btn: Button
    communicatorId: string
}

export default function ButtonTile({ btn, communicatorId }: Props) {
    const [pressed, setPressed] = useState(false)

    const handleTap = async () => {
        if (pressed) return
        setPressed(true)

        speak(btn.tts_text ?? btn.label)

        await logEvent(btn.id, communicatorId, {
            button_label: btn.label,
            button_category: btn.category,
            button_image_url: btn.image_url,
        })

        setTimeout(() => setPressed(false), 600)
    }

    return (
        <button
            type="button"
            onClick={handleTap}
            aria-label={`${btn.label}, ${btn.category}`}
            aria-busy={pressed}
            aria-disabled={pressed}
            className='flex flex-col items-center justify-center rounded-2xl text-white text-sm font-medium text-center shadow-sm aspect-square w-full transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F0E8]'
            style={{
                backgroundColor: btn.color,
                opacity: pressed ? 0.75 : 1,
                transform: pressed ? 'scale(0.95)' : 'scale(1)',
            }}
        >
            {btn.image_url && (
                <span className='text-4xl mb-2' aria-hidden="true">{btn.image_url}</span>
            )}
            <span className='text-base font-semibold'>{btn.label}</span>
        </button>
    )
}