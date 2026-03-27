import { SparklineChart } from '@/components/charts/SparklineChart'
import type { DataPoint, TimeSeries } from '@/lib/types'

interface Props {
  series: TimeSeries
}

function sparklineSlice(data: DataPoint[], frequency: TimeSeries['metadata']['frequency']): DataPoint[] {
  const n =
    frequency === 'daily' ? 252 // ~1 trading year
    : frequency === 'monthly' ? 36 // 3 years
    : frequency === 'quarterly' ? 12 // 3 years
    : 10 // annual: 10 years
  return data.slice(-n)
}

function formatValue(value: number | null, unit: string): string {
  if (value === null) return '—'
  const fixed = value.toFixed(2)
  if (unit.includes('%')) return `${fixed}%`
  if (unit.toLowerCase().includes('index')) return value.toFixed(1)
  return fixed
}

export function IndicatorCard({ series }: Props) {
  const { metadata, data } = series
  const { lastValue, previousValue } = metadata

  const delta =
    lastValue !== null && previousValue !== null && previousValue !== 0
      ? ((lastValue - previousValue) / Math.abs(previousValue)) * 100
      : null

  const positive = delta === null || delta >= 0
  const color = positive ? '#22c55e' : '#ef4444'

  return (
    <a
      href={`/series/${metadata.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-400">
            {metadata.category}
          </p>
          <p className="truncate text-sm font-semibold text-zinc-900">{metadata.label}</p>
        </div>
        {delta !== null && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {positive && delta > 0 ? '+' : ''}
            {delta.toFixed(2)}%
          </span>
        )}
      </div>

      {/* Sparkline */}
      <SparklineChart
        data={sparklineSlice(data, metadata.frequency)}
        seriesId={metadata.id}
        color={color}
      />

      {/* Value + date */}
      <div className="flex items-end justify-between">
        <p className="tabular-nums text-2xl font-bold text-zinc-900">
          {formatValue(lastValue, metadata.unit)}
        </p>
        <p className="text-xs text-zinc-400">{metadata.lastDate}</p>
      </div>

      <p className="text-xs text-zinc-500">{metadata.unit}</p>
    </a>
  )
}
