'use server'

import { createServiceClient } from '@/lib/supabase/server'

export async function getOrCreateBoard(communicatorId: string) {
  const supabase = createServiceClient()

  const { data: existing, error: fetchError } = await supabase
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
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('buttons')
    .insert({
      board_id: boardId,
      position: currentButtonCount,
      ...fields,
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