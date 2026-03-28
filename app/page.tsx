import { getLocale, getTranslations } from 'next-intl/server'

import { LanguageToggle } from '@/components/LanguageToggle'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { fetchNorgesBankSeries } from '@/lib/norges-bank/client'
import { dashboardSeriesIds, seriesRegistry } from '@/lib/series-registry'
import { fetchSsbSeries } from '@/lib/ssb/client'
import type { TimeSeries } from '@/lib/types'

async function fetchDashboardSeries(): Promise<TimeSeries[]> {
  const results = await Promise.allSettled(
    dashboardSeriesIds.map((id) => {
      const config = seriesRegistry[id]
      if (!config) return Promise.reject(new Error(`Unknown series id: ${id}`))
      return config.source === 'norges-bank'
        ? fetchNorgesBankSeries(config)
        : fetchSsbSeries(config)
    }),
  )

  return results
    .filter((r): r is PromiseFulfilledResult<TimeSeries> => r.status === 'fulfilled')
    .map((r) => r.value)
}

export default async function DashboardPage() {
  const [series, t, locale] = await Promise.all([
    fetchDashboardSeries(),
    getTranslations('dashboard'),
    getLocale(),
  ])

  const nav = await getTranslations('nav')

  return (
    <div className="min-h-screen">
      <header className="glass-elevated sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">{t('title')}</h1>
              <p className="mt-1 text-sm text-text-muted">{t('subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/series" className="text-sm font-medium text-accent hover:text-teal-400">
                {nav('allSeries')}
              </a>
              <LanguageToggle locale={locale} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardGrid series={series} />
      </main>
    </div>
  )
}
