'use client'

import { useTranslations } from 'next-intl'

export interface SeriesItem {
  id: string
  label: string
  unit: string
  frequency: string
  category: string
  source: string
}

export function SeriesCard({ series }: { series: SeriesItem }) {
  const t = useTranslations()
  return (
    <a
      href={`/series/${series.id}`}
      className="glass-panel glass-specular flex flex-col gap-2 rounded-2xl p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">{series.label}</p>
        <span className="glass-tag shrink-0 px-2 py-0.5 text-xs font-medium capitalize">
          {series.category}
        </span>
      </div>
      <p className="text-xs text-text-muted">{series.unit}</p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs text-text-muted">
          {t(`frequencies.${series.frequency}`, { fallback: series.frequency })}
        </span>
        <span className="text-xs text-text-muted">
          {t(`sources.${series.source}`, { fallback: series.source })}
        </span>
      </div>
    </a>
  )
}
