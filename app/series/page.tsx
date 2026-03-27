import { getLocale, getTranslations } from 'next-intl/server'

import { LanguageToggle } from '@/components/LanguageToggle'
import type { SeriesItem } from '@/components/series/SeriesCard'
import { SeriesSearch } from '@/components/series/SeriesSearch'
import { seriesRegistry } from '@/lib/series-registry'

export default async function SeriesExplorerPage() {
  const [t, nav, locale] = await Promise.all([
    getTranslations('explorer'),
    getTranslations('nav'),
    getLocale(),
  ])

  const allSeries: SeriesItem[] = Object.values(seriesRegistry).map((c) => ({
    id: c.id,
    label: c.label,
    unit: c.unit,
    frequency: c.frequency,
    category: c.category,
    source: c.source,
  }))

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm text-zinc-400 hover:text-zinc-600">
              {nav('backToDashboard')}
            </a>
            <LanguageToggle locale={locale} />
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('subtitle')}</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <SeriesSearch series={allSeries} />
      </main>
    </div>
  )
}
