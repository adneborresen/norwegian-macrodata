import JSONstat from 'jsonstat-toolkit'

import type { DataPoint, SsbSeriesConfig } from '@/lib/types'
import type { JsonStat2Dataset } from './types'

type TransformConfig = Pick<
  SsbSeriesConfig,
  'timeDimId' | 'contentsDimId' | 'valueCode' | 'fixedDims'
>

/**
 * Transform an SSB json-stat2 response into a flat DataPoint array.
 *
 * Uses jsonstat-toolkit's Dataset.Data() to safely retrieve each observation,
 * which handles null values (unavailable / confidential cells) automatically.
 *
 * Time categories are extracted from the raw json-stat2 structure (sorted by
 * their flat-array position) and used as the iteration keys for Data().
 */
export function transformJsonStat2(raw: JsonStat2Dataset, config: TransformConfig): DataPoint[] {
  const j = JSONstat(raw)
  const dataset = j.Dataset(0)

  // Get time categories in their correct order from the raw dimension index
  const timeCatIndex = raw.dimension[config.timeDimId]?.category.index ?? {}
  const timeCats = Object.entries(timeCatIndex)
    .sort(([, a], [, b]) => a - b)
    .map(([id]) => id)

  return timeCats.map((date) => {
    const coords: Record<string, string> = {
      ...config.fixedDims,
      [config.contentsDimId]: config.valueCode,
      [config.timeDimId]: date,
    }

    const point = dataset.Data(coords)
    const status = point?.status ?? undefined

    return {
      date,
      value: point?.value ?? null,
      ...(status !== null && status !== undefined ? { status } : {}),
    }
  })
}
