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
  const color = positive ? '#34d399' : '#f87171'

  return (
    <a
      href={`/series/${metadata.id}`}
      className="glass-panel group flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
            {metadata.category}
          </p>
          <p className="truncate text-sm font-semibold text-slate-100">{metadata.label}</p>
        </div>
        {delta !== null && (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
              positive
                ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-400'
                : 'border-red-400/30 bg-red-400/15 text-red-400'
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
        <p className="tabular-nums text-2xl font-bold text-white">
          {formatValue(lastValue, metadata.unit)}
        </p>
        <p className="text-xs text-slate-500">{metadata.lastDate}</p>
      </div>

      <p className="text-xs text-slate-500">{metadata.unit}</p>
    </a>
  )
}
