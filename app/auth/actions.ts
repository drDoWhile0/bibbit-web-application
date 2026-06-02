'use server'

import { createServiceClient } from '@/lib/supabase/server'

export async function createProfile(
  id: string,
  fullName: string,
  email: string
) {
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('profiles')
    .insert({ id, full_name: fullName, email })

  if (error) throw new Error(error.message)
}