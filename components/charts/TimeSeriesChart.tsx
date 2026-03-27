'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { DataPoint } from '@/lib/types'

// Merge primary + optional comparison into a single flat array for Recharts.
interface MergedPoint {
  date: string
  primary: number | null
  compare: number | null
}

function mergeData(primary: DataPoint[], compare: DataPoint[] | undefined): MergedPoint[] {
  const compareMap = new Map(compare?.map((p) => [p.date, p.value]))
  return primary.map((p) => ({
    date: p.date,
    primary: p.value,
    compare: compare !== undefined ? (compareMap.get(p.date) ?? null) : null,
  }))
}

interface Props {
  data: DataPoint[]
  unit?: string
  color?: string
  compareData?: DataPoint[]
  compareLabel?: string
  compareColor?: string
}

export function TimeSeriesChart({
  data,
  unit,
  color = '#3b82f6',
  compareData,
  compareLabel,
  compareColor = '#f59e0b',
}: Props) {
  const merged = mergeData(data, compareData)
  const hasCompare = compareData !== undefined

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={merged} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => (unit?.includes('%') ? `${v}%` : String(v))}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e5e7eb' }}
          formatter={(value: number | string | readonly (string | number)[] | undefined) => [
            typeof value === 'number' ? value.toFixed(2) : '—',
            unit ?? '',
          ]}
        />
        {hasCompare && <Legend wrapperStyle={{ fontSize: 12 }} />}
        <Line
          type="monotone"
          dataKey="primary"
          {...(hasCompare ? { name: 'Primary' } : {})}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
        {hasCompare && (
          <Line
            type="monotone"
            dataKey="compare"
            name={compareLabel ?? 'Comparison'}
            stroke={compareColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
