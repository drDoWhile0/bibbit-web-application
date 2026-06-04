'use server'

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

const CreateButtonSchema = z.object({
  boardId: z.uuidv4(),
  currentButtonCount: z.number().int().min(0),
  fields: z.object({
    label: z.string().min(1).max(50),
    category: z.enum(['feeling', 'need']),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
    image_url: z.string().optional(),
    tts_text: z.string().max(200).optional(),
  }),
})

const AcknowledgeEventSchema = z.object({
  eventId: z.uuidv4(),
  acknowledgerId: z.uuidv4(),
  acknowledgmentType: z.enum(['on_my_way', 'give_me_a_moment', 'i_hear_you']),
})

const DeleteButtonSchema = z.object({
  buttonId: z.uuidv4(),
})

export async function getOrCreateBoard(communicatorId: string) {
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('button_boards')
    .select('*, buttons(*)')
    .eq('communicator_id', communicatorId)
    .eq('is_active', true)
    .single()

  if (existing) return existing

  const { data: newBoard, error: createError } = await supabase
    .from('button_boards')
    .insert({ communicator_id: communicatorId, name: 'Main Board', is_active: true })
    .select('*, buttons(*)')
    .single()

  if (createError) throw new Error(createError.message)

  return newBoard
}

export async function createButton(
  boardId: string,
  currentButtonCount: number,
  fields: {
    label: string
    category: 'feeling' | 'need'
    color: string
    image_url?: string
    tts_text?: string
  }
) {
  const validated = CreateButtonSchema.parse({ boardId, currentButtonCount, fields })

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('buttons')
    .insert({
      board_id: validated.boardId,
      position: validated.currentButtonCount,
      ...validated.fields,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function updateButtonPositions(updates: { id: string, position: number } []) {
    const supabase = createServiceClient()

    await Promise.all(
        updates.map(({ id, position }) =>
            supabase.from('buttons').update({ position }).eq('id', id)
        )
    )
}

export async function deleteButton(buttonId: string) {
  const { buttonId: validatedId } = DeleteButtonSchema.parse({ buttonId })

  const supabase = createServiceClient()

  const { error } = await supabase.from('buttons').delete().eq('id', validatedId)

  if (error) throw new Error(error.message)
}

export async function acknowledgeEvent(
  eventId: string,
  acknowledgerId: string,
  acknowledgmentType: 'on_my_way' | 'give_me_a_moment' | 'i_hear_you'
) {
  const validated = AcknowledgeEventSchema.parse({ eventId, acknowledgerId, acknowledgmentType })

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('events')
    .update({
      acknowledgment_type: validated.acknowledgmentType,
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: validated.acknowledgerId,
    })
    .eq('id', validated.eventId)

  if (error) throw new Error(error.message)
}