'use client'

import { useEffect } from 'react'

const MESSAGES: Record<string, string> = {
  i_hear_you: 'Your caregiver hears you 💙',
  on_my_way: 'Your caregiver is on their way 🏃',
  give_me_a_moment: 'Your caregiver needs a moment ⏳',
}

interface Props {
  acknowledgmentType: 'on_my_way' | 'give_me_a_moment' | 'i_hear_you'
  onDismiss: () => void
}

export default function AcknowledgmentBanner({ acknowledgmentType, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 10000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] px-6 py-4 flex items-center gap-3 min-w-[280px] max-w-sm">
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#2D4A3E] text-center">
            {MESSAGES[acknowledgmentType]}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-[#9CA3AF] hover:text-[#2D4A3E] text-xs flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  )
}