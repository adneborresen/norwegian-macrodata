import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import { transformSdmxJson } from './transform'
import type { SdmxJsonMessage } from './types'

const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'fixtures/nb-policy-rate.json'), 'utf8')
) as SdmxJsonMessage

const eurNokFixture = JSON.parse(
  readFileSync(join(process.cwd(), 'fixtures/nb-eurusd.json'), 'utf8')
) as SdmxJsonMessage

describe('transformSdmxJson (policy rate)', () => {
  const result = transformSdmxJson(fixture)

  it('returns an array of DataPoints', () => {
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('output is sorted by date ascending', () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i]!.date >= result[i - 1]!.date).toBe(true)
    }
  })

  it('parses string values to numbers', () => {
    const withValues = result.filter((p) => p.value !== null)
    expect(withValues.length).toBeGreaterThan(0)
    withValues.forEach((p) => {
      expect(typeof p.value).toBe('number')
      expect(isNaN(p.value as number)).toBe(false)
    })
  })

  it('policy rate values are plausible (0–20%)', () => {
    result.filter((p) => p.value !== null).forEach((p) => {
      expect(p.value).toBeGreaterThanOrEqual(0)
      expect(p.value).toBeLessThanOrEqual(20)
    })
  })

  it('dates are ISO date strings (YYYY-MM-DD)', () => {
    result.forEach((p) => {
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})

describe('transformSdmxJson (EUR/NOK)', () => {
  const result = transformSdmxJson(eurNokFixture)

  it('returns data points with plausible EUR/NOK values (8–20)', () => {
    const withValues = result.filter((p) => p.value !== null)
    expect(withValues.length).toBeGreaterThan(0)
    withValues.forEach((p) => {
      expect(p.value).toBeGreaterThan(8)
      expect(p.value).toBeLessThan(20)
    })
  })

  it('output is sorted by date ascending', () => {
    for (let i = 1; i < result.length; i++) {
      expect(result[i]!.date >= result[i - 1]!.date).toBe(true)
    }
  })
})
