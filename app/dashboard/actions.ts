'use server'

import { createServiceClient } from '@/lib/supabase/server'

export async function createCommunicator(
  userId: string,
  name: string,
  avatarUrl: string
) {

  const supabase = createServiceClient()

  const { data: communicator, error: commError } = await supabase
    .from('communicators')
    .insert({ name, avatar_url: avatarUrl, created_by: userId })
    .select()
    .single()

  if (commError) throw new Error(commError.message)

  const { error: linkError } = await supabase
    .from('caregiver_communicator')
    .insert({
      caregiver_id: userId,
      communicator_id: communicator.id,
      relationship: 'parent',
    })

  if (linkError) throw new Error(linkError.message)
}