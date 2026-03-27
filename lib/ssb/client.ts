import { unstable_cache } from 'next/cache'

import type { SeriesMetadata, SsbSeriesConfig, TimeSeries } from '@/lib/types'

import { transformJsonStat2 } from './transform'
import type { JsonStat2Dataset } from './types'

const SSB_BASE_URL = 'https://data.ssb.no/api/pxwebapi/v2/tables'

function revalidateSeconds(frequency: SsbSeriesConfig['frequency']): number {
  // Annual and quarterly data change at most once per quarter/year
  if (frequency === 'annual' || frequency === 'quarterly') return 2592000 // 30 days
  return 604800 // 7 days — monthly indicators don't change mid-month
}

// SSB PxWebApi v2 requires POST for variable selection. Next.js does not cache
// POST fetches via the fetch() next.revalidate option, so we wrap the raw HTTP
// call in unstable_cache. The cache key is [tableId, ...selectionCodes] which
// is stable for a given series config.
async function fetchRaw(
  tableId: string,
  selection: Array<{ variableCode: string; valueCodes: string[] }>
): Promise<JsonStat2Dataset> {
  const url = `${SSB_BASE_URL}/${tableId}/data?lang=en&outputFormat=json-stat2`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selection }),
    cache: 'no-store', // unstable_cache controls persistence
  })
  if (!res.ok) throw new Error(`SSB API ${res.status}: table ${tableId}`)
  return res.json() as Promise<JsonStat2Dataset>
}

export async function fetchSsbSeries(config: SsbSeriesConfig): Promise<TimeSeries> {
  const selection = [
    { variableCode: config.contentsDimId, valueCodes: [config.valueCode] },
    ...Object.entries(config.fixedDims).map(([variableCode, valueCode]) => ({
      variableCode,
      valueCodes: [valueCode],
    })),
    { variableCode: config.timeDimId, valueCodes: ['*'] },
  ]

  // Stable cache key: ['ssb', seriesId] — one entry per series
  const cached = unstable_cache(
    () => fetchRaw(config.tableId, selection),
    ['ssb', config.id],
    { revalidate: revalidateSeconds(config.frequency), tags: [`series-${config.id}`] }
  )

  const raw = await cached()
  const data = transformJsonStat2(raw, config)

  const nonNullPoints = [...data].reverse().filter((p) => p.value !== null)
  const lastNonNull = nonNullPoints[0]
  const prevNonNull = nonNullPoints[1]

  const metadata: SeriesMetadata = {
    id: config.id,
    label: config.label,
    unit: config.unit,
    frequency: config.frequency,
    source: 'ssb',
    sourceId: config.tableId,
    category: config.category,
    lastValue: lastNonNull?.value ?? null,
    lastDate: lastNonNull?.date ?? '',
    previousValue: prevNonNull?.value ?? null,
    ...(config.description !== undefined ? { description: config.description } : {}),
    ...(raw.updated !== undefined ? { updatedAt: raw.updated } : {}),
  }

  return { metadata, data }
}
