'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { applyTransform, filterByFrom, type Transform } from '@/lib/transforms/time-series'
import type { TimeSeries } from '@/lib/types'

import { DateRangeControl } from './DateRangeControl'

export interface SeriesOption {
  id: string
  label: string
}

interface Props {
  primary: TimeSeries
  comparison?: TimeSeries
  allSeries: SeriesOption[]
}

const TRANSFORMS: { value: Transform; label: string }[] = [
  { value: 'raw', label: 'Raw' },
  { value: 'yoy', label: 'YoY %' },
  { value: 'mom', label: 'MoM %' },
]

const SOURCE_LABELS: Record<string, string> = {
  ssb: 'Statistics Norway (SSB)',
  'norges-bank': 'Norges Bank',
}

function downloadCsv(
  data: Array<{ date: string; value: number | null }>,
  filename: string,
): void {
  const lines = ['date,value', ...data.map((p) => `${p.date},${p.value ?? ''}`)]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function SeriesDetailClient({ primary, comparison, allSeries }: Props) {
  const router = useRouter()
  const sp = useSearchParams()

  const from = sp.get('from') ?? undefined
  const transform = (sp.get('transform') ?? 'raw') as Transform
  const compareId = sp.get('compare') ?? ''

  function setParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(sp.toString())
    if (value === undefined || value === '') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    const qs = next.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }

  const primaryData = useMemo(
    () => applyTransform(filterByFrom(primary.data, from), transform, primary.metadata.frequency),
    [primary.data, primary.metadata.frequency, from, transform],
  )

  const compData = useMemo(() => {
    if (!comparison) return undefined
    return applyTransform(
      filterByFrom(comparison.data, from),
      transform,
      comparison.metadata.frequency,
    )
  }, [comparison, from, transform])

  return (
    <div className="flex flex-col gap-4">
      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <DateRangeControl />

        {/* Transform selector */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
          {TRANSFORMS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setParam('transform', value === 'raw' ? undefined : value)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                transform === value
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Comparison selector */}
        <select
          value={compareId}
          onChange={(e) => setParam('compare', e.target.value || undefined)}
          className="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Compare with…</option>
          {allSeries
            .filter((s) => s.id !== primary.metadata.id)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
        </select>

        {/* CSV download */}
        <button
          onClick={() => downloadCsv(primaryData, `${primary.metadata.id}.csv`)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
        >
          ↓ CSV
        </button>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
        <TimeSeriesChart
          data={primaryData}
          unit={primary.metadata.unit}
          {...(compData !== undefined && comparison !== undefined
            ? { compareData: compData, compareLabel: comparison.metadata.label }
            : {})}
        />
      </div>

      {/* Metadata footer */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400">
        <span>Source: {SOURCE_LABELS[primary.metadata.source] ?? primary.metadata.source}</span>
        <span>Frequency: {primary.metadata.frequency}</span>
        {primary.metadata.updatedAt !== undefined && (
          <span>Updated: {primary.metadata.updatedAt.slice(0, 10)}</span>
        )}
        {comparison !== undefined && (
          <span>
            Comparing with: {comparison.metadata.label} (
            {SOURCE_LABELS[comparison.metadata.source] ?? comparison.metadata.source})
          </span>
        )}
      </div>
    </div>
  )
}
