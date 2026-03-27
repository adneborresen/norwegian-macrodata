import { seriesRegistry } from '@/lib/series-registry'
import type { SeriesMetadata } from '@/lib/types'

// Lightweight catalog — no upstream fetches, no live values.
// For lastValue / lastDate / previousValue use GET /api/series/[id].
type SeriesListEntry = Omit<SeriesMetadata, 'lastValue' | 'lastDate' | 'previousValue' | 'updatedAt'>

export async function GET(): Promise<Response> {
  const list: SeriesListEntry[] = Object.values(seriesRegistry).map((c) => ({
    id: c.id,
    label: c.label,
    unit: c.unit,
    frequency: c.frequency,
    source: c.source,
    sourceId: c.source === 'norges-bank' ? `${c.dataflow}/${c.key}` : c.tableId,
    category: c.category,
    ...(c.description !== undefined ? { description: c.description } : {}),
  }))

  return Response.json(list)
}
