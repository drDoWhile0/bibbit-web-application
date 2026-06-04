interface EventData {
  pressed_at: string
  button_category: 'feeling' | 'need'
  button_label: string
}

interface InsightInput {
  events: EventData[]
  communicatorName: string
  days: 7 | 30 | 90
}

function getHour(iso: string) {
  return new Date(iso).getHours()
}

function getDayName(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: 'long' })
}

export function generateInsights({ events, communicatorName, days }: InsightInput): string[] {
  if (events.length < 3) return []

  const insights: string[] = []

  // 1. Feeling vs need split
  const feelingCount = events.filter((e) => e.button_category === 'feeling').length
  const needCount = events.filter((e) => e.button_category === 'need').length
  const total = events.length
  const feelingPct = Math.round((feelingCount / total) * 100)
  const needPct = 100 - feelingPct

  if (feelingPct >= 60) {
    insights.push(`${feelingPct}% of ${communicatorName}'s expressions this period are feelings — emotional communication is dominant.`)
  } else if (needPct >= 60) {
    insights.push(`${needPct}% of ${communicatorName}'s expressions this period are needs — consider expanding the feelings vocabulary on their board.`)
  } else {
    insights.push(`${communicatorName}'s communication is balanced — ${feelingPct}% feelings and ${needPct}% needs this period.`)
  }

  // 2. Most active hour
  const hourCounts: Record<number, number> = {}
  for (const e of events) {
    const h = getHour(e.pressed_at)
    hourCounts[h] = (hourCounts[h] ?? 0) + 1
  }
  const peakHour = parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
  const peakHourLabel = new Date(0, 0, 0, peakHour).toLocaleTimeString([], { hour: 'numeric', hour12: true })
  const peakHourEndLabel = new Date(0, 0, 0, peakHour + 1).toLocaleTimeString([], { hour: 'numeric', hour12: true })
  insights.push(`Most active time: ${peakHourLabel}–${peakHourEndLabel}. Consider being especially attentive during this window.`)

  // 3. Most active day of week
  const dayCounts: Record<string, number> = {}
  for (const e of events) {
    const day = getDayName(e.pressed_at)
    dayCounts[day] = (dayCounts[day] ?? 0) + 1
  }
  const peakDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]
  insights.push(`${communicatorName} communicates most on ${peakDay}s — ${dayCounts[peakDay]} presses on average.`)

  // 4. Most used button
  const labelCounts: Record<string, number> = {}
  for (const e of events) {
    labelCounts[e.button_label] = (labelCounts[e.button_label] ?? 0) + 1
  }
  const topLabel = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0]
  if (topLabel[1] > 1) {
    insights.push(`Most used button: "${topLabel[0]}" — pressed ${topLabel[1]} times this period.`)
  }

  return insights.slice(0, 3)
}