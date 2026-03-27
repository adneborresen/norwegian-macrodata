import type { TimeSeries } from '@/lib/types'

import { IndicatorCard } from './IndicatorCard'

interface Props {
  series: TimeSeries[]
}

export function DashboardGrid({ series }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {series.map((s) => (
        <IndicatorCard key={s.metadata.id} series={s} />
      ))}
    </div>
  )
}
