'use server'

import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"

const LogEventSchema = z.object({
    buttonId: z.uuidv4(),
    communicatorId: z.uuidv4(),
    snapshot: z.object({
        button_label: z.string().min(1).max(100),
        button_category: z.enum(['feeling', 'need']),
        button_image_url: z.string().optional(),
    }),
})

export async function logEvent(
    buttonId: string,
    communicatorId: string,
    snapshot: {
        button_label: string
        button_category: 'feeling' | 'need'
        button_image_url?: string
    }
) {
    const validated = LogEventSchema.parse({ buttonId, communicatorId, snapshot })

    const supabase = createServiceClient()

    const { error } = await supabase.from('events').insert({
        button_id: validated.buttonId,
        communicator_id: validated.communicatorId,
        ...validated.snapshot,
    })

    if (error) throw new Error(error.message)
}