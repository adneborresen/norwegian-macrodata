export interface SeriesItem {
  id: string
  label: string
  unit: string
  frequency: string
  category: string
  source: string
}

const FREQ_LABELS: Record<string, string> = {
  daily: 'Daily',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
}

const SOURCE_LABELS: Record<string, string> = {
  ssb: 'SSB',
  'norges-bank': 'Norges Bank',
}

export function SeriesCard({ series }: { series: SeriesItem }) {
  return (
    <a
      href={`/series/${series.id}`}
      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-zinc-900">{series.label}</p>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize text-zinc-600">
          {series.category}
        </span>
      </div>
      <p className="text-xs text-zinc-500">{series.unit}</p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs text-zinc-400">
          {FREQ_LABELS[series.frequency] ?? series.frequency}
        </span>
        <span className="text-xs text-zinc-400">
          {SOURCE_LABELS[series.source] ?? series.source}
        </span>
      </div>
    </a>
  )
}
