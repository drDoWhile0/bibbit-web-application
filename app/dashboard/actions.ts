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

export async function fetchEventFrequency(
  communicatorId: string,
  days: 7 | 30 | 90
) {
  const supabase = createServiceClient()

  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('events')
    .select('pressed_at')
    .eq('communicator_id', communicatorId)
    .gte('pressed_at', since.toISOString())
    .order('pressed_at', { ascending: true })

    if (error) throw new Error(error.message)

    // Group by day
    const counts: Record<string, number> = {}

    // Pre-fill all days with 0 so empty days still show on the chart
    for (let i = 0; i < days; i ++) {
      const d = new Date()
      d.setDate(d.getDate() - (days - 1 - i))
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      counts[key] = 0
    }

    // Count events per day
    for (const event of data ?? []) {
      const key = event.pressed_at.split('T')[0]
      if (key in counts) counts[key]++
    }

    return Object.entries(counts).map(([date, count]) => ({ date, count }))
}

export async function fetchDayOfWeekData(communicatorId: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('events')
    .select('pressed_at, button_category')
    .eq('communicator_id', communicatorId)

  if (error) throw new Error(error.message)

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const counts: Record<string, { feeling: number, need: number }> = {}
  for (const day of days) {
    counts[day] = { feeling: 0, need: 0 }
  }

  for (const event of data ?? []) {
    const date = new Date(event.pressed_at)
    const dayIndex = date.getDay()
    const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]
    counts[dayName][event.button_category as 'feeling' | 'need']++
  }

  return days.map((day) => ({ day, ...counts[day] }))
}

export async function fetchCategorySplit(
  communicatorId: string,
  days: 7 | 30 | 90
) {
  const supabase = createServiceClient()

  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('events')
    .select('button_category')
    .eq('communicator_id', communicatorId)
    .gte('pressed_at', since.toISOString())

  if (error) throw new Error(error.message)

  let feeling = 0
  let need = 0

  for (const event of data ?? []) {
    if (event.button_category === 'feeling') feeling++
    else need++
  }

  return { feeling, need, total: feeling + need }
}

export async function fetchEventsForInsights(
  communicatorId: string,
  days: 7 | 30 | 90
) {
  const supabase = createServiceClient()

  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('events')
    .select('pressed_at, button_category, button_label')
    .eq('communicator_id', communicatorId)
    .gte('pressed_at', since.toISOString())
    .order('pressed_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}