import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'

import { LanguageToggle } from '@/components/LanguageToggle'
import { SeriesDetailClient, type SeriesOption } from '@/components/series/SeriesDetailClient'
import { fetchNorgesBankSeries } from '@/lib/norges-bank/client'
import { seriesRegistry } from '@/lib/series-registry'
import { fetchSsbSeries } from '@/lib/ssb/client'
import type { TimeSeries } from '@/lib/types'

async function fetchSeries(id: string): Promise<TimeSeries | null> {
  const config = seriesRegistry[id]
  if (!config) return null
  try {
    return config.source === 'norges-bank'
      ? await fetchNorgesBankSeries(config)
      : await fetchSsbSeries(config)
  } catch {
    return null
  }
}

export default async function SeriesDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ compare?: string }>
}) {
  const { id } = await params
  const { compare } = await searchParams

  const [primary, comparison, nav, locale] = await Promise.all([
    fetchSeries(id),
    compare ? fetchSeries(compare) : Promise.resolve(null),
    getTranslations('nav'),
    getLocale(),
  ])

  if (!primary) notFound()

  const allSeries: SeriesOption[] = Object.values(seriesRegistry).map((c) => ({
    id: c.id,
    label: c.label,
  }))

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/series" className="text-sm text-zinc-400 hover:text-zinc-600">
              {nav('backToAllSeries')}
            </a>
            <LanguageToggle locale={locale} />
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
            {primary.metadata.label}
          </h1>
          {primary.metadata.description !== undefined && (
            <p className="mt-1 text-sm text-zinc-500">{primary.metadata.description}</p>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <SeriesDetailClient
          primary={primary}
          allSeries={allSeries}
          {...(comparison !== null ? { comparison } : {})}
        />
      </main>
    </div>
  )
}
