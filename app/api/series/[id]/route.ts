import { fetchNorgesBankSeries } from '@/lib/norges-bank/client'
import { seriesRegistry } from '@/lib/series-registry'
import { fetchSsbSeries } from '@/lib/ssb/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params
  const config = seriesRegistry[id]

  if (!config) {
    return Response.json({ error: 'Series not found' }, { status: 404 })
  }

  try {
    const series =
      config.source === 'norges-bank'
        ? await fetchNorgesBankSeries(config)
        : await fetchSsbSeries(config)

    return Response.json(series)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upstream fetch failed'
    return Response.json({ error: message }, { status: 502 })
  }
}
