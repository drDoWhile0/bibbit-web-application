'use server'

import { createServiceClient } from "@/lib/supabase/server"

export async function logEvent(
    buttonId: string,
    communicatorId: string,
    snapshot: {
        button_label: string
        button_category: 'feeling' | 'need'
        button_image_url?: string
    }
) {
    const supabase = createServiceClient()

    const { error } = await supabase.from('events').insert({
        button_id: buttonId,
        communicator_id: communicatorId,
        ...snapshot,
    })

    if (error) throw new Error(error.message)
 }