'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import type { DataPoint } from '@/lib/types'

interface Props {
  data: DataPoint[]
  seriesId: string
  color?: string
}

export function SparklineChart({ data, seriesId, color = '#3b82f6' }: Props) {
  const gradientId = `sparkline-${seriesId}`
  return (
    <ResponsiveContainer width="100%" height={56}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
