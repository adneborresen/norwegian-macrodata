'use client'

import { useTranslations } from 'next-intl'
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

const TRANSFORM_KEYS = ['raw', 'yoy', 'mom'] as const

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
  const t = useTranslations()
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
        <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-1">
          {TRANSFORM_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setParam('transform', key === 'raw' ? undefined : key)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                transform === key
                  ? 'glass-button-active'
                  : 'text-text-muted hover:bg-[rgba(255,255,255,0.06)]'
              }`}
            >
              {t(`transforms.${key}`)}
            </button>
          ))}
        </div>

        {/* Comparison selector */}
        <select
          value={compareId}
          onChange={(e) => setParam('compare', e.target.value || undefined)}
          className="glass-input h-9 px-2 text-sm"
        >
          <option value="">{t('detail.compareWith')}</option>
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
          className="glass-button px-3 py-1.5 text-sm font-medium"
        >
          {t('detail.downloadCsv')}
        </button>
      </div>

      {/* Chart */}
      <div className="glass-panel glass-specular rounded-xl p-4 sm:p-6">
        <TimeSeriesChart
          data={primaryData}
          unit={primary.metadata.unit}
          {...(compData !== undefined && comparison !== undefined
            ? { compareData: compData, compareLabel: comparison.metadata.label }
            : {})}
        />
      </div>

      {/* Metadata footer */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-muted">
        <span>{t('detail.source')}: {t(`sources.${primary.metadata.source}`, { fallback: primary.metadata.source })}</span>
        <span>{t('detail.frequency')}: {t(`frequencies.${primary.metadata.frequency}`, { fallback: primary.metadata.frequency })}</span>
        {primary.metadata.updatedAt !== undefined && (
          <span>{t('detail.updated')}: {primary.metadata.updatedAt.slice(0, 10)}</span>
        )}
        {comparison !== undefined && (
          <span>
            {t('detail.comparingWith')}: {comparison.metadata.label} (
            {t(`sources.${comparison.metadata.source}`, { fallback: comparison.metadata.source })})
          </span>
        )}
      </div>
    </div>
  )
}
