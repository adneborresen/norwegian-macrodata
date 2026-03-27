import { revalidateTag } from 'next/cache'

// POST /api/revalidate?tag=series-cpi&secret=<REVALIDATE_SECRET>
// Busts the ISR cache for the given tag. Used for on-demand invalidation
// when upstream data changes (e.g. after an SSB release).
export async function POST(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const tag = searchParams.get('tag')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!tag) {
    return Response.json({ error: 'Missing required query param: tag' }, { status: 400 })
  }

  // expire: 0 — immediate invalidation (suitable for webhooks)
  revalidateTag(tag, { expire: 0 })
  return Response.json({ revalidated: true, tag })
}
