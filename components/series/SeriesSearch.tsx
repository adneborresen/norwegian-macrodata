'use client'

import { useState } from 'react'

import { SeriesCard, type SeriesItem } from './SeriesCard'

const CATEGORIES = ['all', 'growth', 'labor', 'monetary', 'prices', 'external'] as const

export function SeriesSearch({ series }: { series: SeriesItem[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const filtered = series.filter((s) => {
    const matchesQuery =
      query === '' ||
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || s.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search series…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="glass-input h-9 w-56 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
        />
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                category === cat ? 'glass-button-active' : 'glass-button'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">No series match your search.</p>
      )}
    </div>
  )
}
