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
  const color = positive ? '#4ade80' : '#f87171'

  return (
    <a
      href={`/series/${metadata.id}`}
      className="glass-panel glass-specular group flex flex-col gap-3 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-text-muted">
            {metadata.category}
          </p>
          <p className="truncate text-sm font-semibold text-text-primary">{metadata.label}</p>
        </div>
        {delta !== null && (
          <span
            className={`glass-tag shrink-0 px-2 py-0.5 text-xs font-medium ${
              positive
                ? 'border-green-400/30 bg-[rgba(34,197,94,0.12)] text-green-400'
                : 'border-red-400/30 bg-[rgba(239,68,68,0.12)] text-red-400'
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
        <p className="tabular-nums text-2xl font-bold text-text-primary">
          {formatValue(lastValue, metadata.unit)}
        </p>
        <p className="text-xs text-text-muted">{metadata.lastDate}</p>
      </div>

      <p className="text-xs text-text-muted">{metadata.unit}</p>
    </a>
  )
}
