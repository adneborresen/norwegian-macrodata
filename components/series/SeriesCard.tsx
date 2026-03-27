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
      className="glass-panel flex flex-col gap-2 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{series.label}</p>
        <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs font-medium capitalize text-slate-300">
          {series.category}
        </span>
      </div>
      <p className="text-xs text-slate-500">{series.unit}</p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs text-slate-500">
          {FREQ_LABELS[series.frequency] ?? series.frequency}
        </span>
        <span className="text-xs text-slate-500">
          {SOURCE_LABELS[series.source] ?? series.source}
        </span>
      </div>
    </a>
  )
}
