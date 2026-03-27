import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import { transformJsonStat2 } from './transform'
import type { JsonStat2Dataset } from './types'

const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'fixtures/ssb-cpi-14700.json'), 'utf8')
) as JsonStat2Dataset

const cpiIndexConfig = {
  timeDimId: 'Tid',
  contentsDimId: 'ContentsCode',
  valueCode: 'KpiIndMnd', // CPI index — no nulls
  fixedDims: { VareTjenesteGrp: '00' },
}

const cpi12mConfig = {
  timeDimId: 'Tid',
  contentsDimId: 'ContentsCode',
  valueCode: 'Tolvmanedersendring', // 12-month rate — first 12 months are null
  fixedDims: { VareTjenesteGrp: '00' },
}

describe('transformJsonStat2 (CPI index)', () => {
  const result = transformJsonStat2(fixture, cpiIndexConfig)

  it('returns one DataPoint per time period', () => {
    expect(result.length).toBe(314) // 2000M01 – 2026M02
  })

  it('first date is 2000M01', () => {
    expect(result[0]!.date).toBe('2000M01')
  })

  it('last date is 2026M02', () => {
    expect(result[result.length - 1]!.date).toBe('2026M02')
  })

  it('output is sorted by date ascending', () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i]!.date >= result[i - 1]!.date).toBe(true)
    }
  })

  it('all values are numbers (CPI index has no missing periods)', () => {
    const nullCount = result.filter((p) => p.value === null).length
    expect(nullCount).toBe(0)
    result.forEach((p) => expect(typeof p.value).toBe('number'))
  })

  it('CPI index values are plausible (10–200)', () => {
    result.forEach((p) => {
      expect(p.value).toBeGreaterThan(10)
      expect(p.value).toBeLessThan(200)
    })
  })
})

describe('transformJsonStat2 (12-month rate — null handling)', () => {
  const result = transformJsonStat2(fixture, cpi12mConfig)

  it('returns one DataPoint per time period', () => {
    expect(result.length).toBe(314)
  })

  it('propagates null for unavailable early periods', () => {
    const nullCount = result.filter((p) => p.value === null).length
    expect(nullCount).toBeGreaterThan(0)
  })

  it('null values appear at the start of the series', () => {
    // The first 12 months cannot have a 12-month rate
    const firstNonNull = result.findIndex((p) => p.value !== null)
    expect(firstNonNull).toBeGreaterThan(0)
    // All points before firstNonNull should be null
    for (let i = 0; i < firstNonNull; i++) {
      expect(result[i]!.value).toBeNull()
    }
  })

  it('non-null 12-month rates are plausible (-5% to 30%)', () => {
    result
      .filter((p) => p.value !== null)
      .forEach((p) => {
        expect(p.value).toBeGreaterThan(-5)
        expect(p.value).toBeLessThan(30)
      })
  })
})
