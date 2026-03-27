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
  color = '#60a5fa',
  compareData,
  compareLabel,
  compareColor = '#fbbf24',
}: Props) {
  const merged = mergeData(data, compareData)
  const hasCompare = compareData !== undefined

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={merged} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => (unit?.includes('%') ? `${v}%` : String(v))}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(12px)',
            color: '#f1f5f9',
          }}
          labelStyle={{ color: '#94a3b8' }}
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
