import type { NorgesBankSeriesConfig, SeriesMetadata, TimeSeries } from '@/lib/types'

import { transformSdmxJson } from './transform'
import type { SdmxJsonMessage } from './types'

const NB_BASE_URL = 'https://data.norges-bank.no/api/data'
const REVALIDATE = 86400 // 24h — rates publish on business days

export async function fetchNorgesBankSeries(config: NorgesBankSeriesConfig): Promise<TimeSeries> {
  const url = `${NB_BASE_URL}/${config.dataflow}/${config.key}?format=sdmx-json&locale=en`

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE, tags: [`series-${config.id}`] },
  })

  if (!res.ok) {
    throw new Error(`Norges Bank API ${res.status} for series "${config.id}"`)
  }

  const raw = (await res.json()) as SdmxJsonMessage
  const data = transformSdmxJson(raw)

  // Walk backwards to find the two most recent non-null values
  const nonNullPoints = [...data].reverse().filter((p) => p.value !== null)
  const lastNonNull = nonNullPoints[0]
  const prevNonNull = nonNullPoints[1]

  const metadata: SeriesMetadata = {
    id: config.id,
    label: config.label,
    unit: config.unit,
    frequency: config.frequency,
    source: 'norges-bank',
    sourceId: `${config.dataflow}/${config.key}`,
    category: config.category,
    lastValue: lastNonNull?.value ?? null,
    lastDate: lastNonNull?.date ?? '',
    previousValue: prevNonNull?.value ?? null,
    ...(config.description !== undefined ? { description: config.description } : {}),
  }

  return { metadata, data }
}
