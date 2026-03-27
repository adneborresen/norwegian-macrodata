'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const RANGES = [
  { label: '1Y', years: 1 },
  { label: '5Y', years: 5 },
  { label: '10Y', years: 10 },
  { label: 'Max', years: null },
] as const

function fromDateForYears(years: number | null): string | undefined {
  if (years === null) return undefined
  const d = new Date()
  d.setFullYear(d.getFullYear() - years)
  return d.toISOString().slice(0, 7) // YYYY-MM
}

export function DateRangeControl() {
  const router = useRouter()
  const sp = useSearchParams()
  const from = sp.get('from') ?? undefined

  function setFrom(value: string | undefined) {
    const next = new URLSearchParams(sp.toString())
    if (value === undefined) {
      next.delete('from')
    } else {
      next.set('from', value)
    }
    const qs = next.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }

  const active = useMemo((): string => {
    if (!from) return 'Max'
    const diff = new Date().getFullYear() - parseInt(from.slice(0, 4), 10)
    if (diff <= 1) return '1Y'
    if (diff <= 5) return '5Y'
    if (diff <= 10) return '10Y'
    return 'Max'
  }, [from])

  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
      {RANGES.map(({ label, years }) => (
        <button
          key={label}
          onClick={() => setFrom(fromDateForYears(years))}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            active === label ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
