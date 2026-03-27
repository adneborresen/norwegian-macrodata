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
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<TimeSeries> => r.status === 'fulfilled')
    .map((r) => r.value)
}

export default async function DashboardPage() {
  const series = await fetchDashboardSeries()

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                Norwegian Macro
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Key economic indicators for Norway
              </p>
            </div>
            <a
              href="/series"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              All series →
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardGrid series={series} />
      </main>
    </div>
  )
}
