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
  if (!compare) {
    return primary.map((p) => ({ date: p.date, primary: p.value, compare: null }))
  }

  const allDates = Array.from(
    new Set([...primary.map((p) => p.date), ...compare.map((p) => p.date)]),
  ).sort()

  const primaryMap = new Map(primary.map((p) => [p.date, p.value]))
  const compareMap = new Map(compare.map((p) => [p.date, p.value]))

  return allDates.map((date) => ({
    date,
    primary: primaryMap.get(date) ?? null,
    compare: compareMap.get(date) ?? null,
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
  color = '#2dd4bf',
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
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => (unit?.includes('%') ? `${v}%` : String(v))}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            color: '#f5f5f5',
          }}
          labelStyle={{ color: '#a1a1aa' }}
          formatter={(value: number | string | readonly (string | number)[] | undefined) => [
            typeof value === 'number' ? value.toFixed(2) : '—',
            unit ?? '',
          ]}
        />
        {hasCompare && <Legend wrapperStyle={{ fontSize: 12, color: '#a1a1aa' }} />}
        <Line
          type="monotone"
          dataKey="primary"
          {...(hasCompare ? { name: 'Primary' } : {})}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls={true}
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
            connectNulls={true}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
