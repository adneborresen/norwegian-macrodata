import type { DataPoint } from '@/lib/types'

export type Transform = 'raw' | 'yoy' | 'mom'

export function filterByFrom(data: DataPoint[], from: string | undefined): DataPoint[] {
  if (from === undefined) return data
  return data.filter((p) => p.date >= from)
}

function applyYoY(data: DataPoint[], periodsPerYear: number): DataPoint[] {
  return data.map((point, i) => {
    if (i < periodsPerYear) return { date: point.date, value: null }
    const prior = data[i - periodsPerYear]
    if (prior === undefined || prior.value === null || point.value === null || prior.value === 0) {
      return { date: point.date, value: null }
    }
    const pct = ((point.value - prior.value) / Math.abs(prior.value)) * 100
    return { date: point.date, value: Math.round(pct * 10000) / 10000 }
  })
}

function applyMoM(data: DataPoint[]): DataPoint[] {
  return data.map((point, i) => {
    if (i === 0) return { date: point.date, value: null }
    const prior = data[i - 1]
    if (prior === undefined || prior.value === null || point.value === null || prior.value === 0) {
      return { date: point.date, value: null }
    }
    const pct = ((point.value - prior.value) / Math.abs(prior.value)) * 100
    return { date: point.date, value: Math.round(pct * 10000) / 10000 }
  })
}

export function applyTransform(
  data: DataPoint[],
  transform: Transform,
  frequency: 'annual' | 'quarterly' | 'monthly' | 'daily',
): DataPoint[] {
  if (transform === 'raw') return data
  if (transform === 'mom') return applyMoM(data)
  const periods =
    frequency === 'monthly' ? 12
    : frequency === 'quarterly' ? 4
    : frequency === 'daily' ? 252
    : 1
  return applyYoY(data, periods)
}
