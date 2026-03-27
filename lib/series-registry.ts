import type { SeriesConfig } from '@/lib/types'

// Master registry of all available series.
// Add a new entry here to expose a new series at GET /api/series/[id].
//
// SSB table IDs confirmed via PxWebApi v2 on 2026-03-27.
// Norges Bank dataflow keys confirmed via query builder on 2026-03-27.

export const seriesRegistry: Record<string, SeriesConfig> = {
  // ── Norges Bank ──────────────────────────────────────────────────────────────

  'policy-rate': {
    source: 'norges-bank',
    id: 'policy-rate',
    label: 'Policy Rate',
    unit: '%',
    frequency: 'daily',
    category: 'monetary',
    dataflow: 'IR',
    key: 'B.KPRA.SD.',
    description: 'Norges Bank key policy rate (sight deposit rate)',
  },

  nowa: {
    source: 'norges-bank',
    id: 'nowa',
    label: 'NOWA Rate',
    unit: '%',
    frequency: 'daily',
    category: 'monetary',
    dataflow: 'IR',
    key: 'B.NOWA.SD.',
    description: 'Norwegian Overnight Weighted Average interest rate',
  },

  'eur-nok': {
    source: 'norges-bank',
    id: 'eur-nok',
    label: 'EUR/NOK',
    unit: 'NOK per EUR',
    frequency: 'daily',
    category: 'external',
    dataflow: 'EXR',
    key: 'B.EUR.NOK.SP',
    description: 'Euro to Norwegian krone spot exchange rate',
  },

  'usd-nok': {
    source: 'norges-bank',
    id: 'usd-nok',
    label: 'USD/NOK',
    unit: 'NOK per USD',
    frequency: 'daily',
    category: 'external',
    dataflow: 'EXR',
    key: 'B.USD.NOK.SP',
    description: 'US dollar to Norwegian krone spot exchange rate',
  },

  // ── SSB StatBank ─────────────────────────────────────────────────────────────

  cpi: {
    source: 'ssb',
    id: 'cpi',
    label: 'CPI Inflation',
    unit: '% (12-month rate)',
    frequency: 'monthly',
    category: 'prices',
    tableId: '14700',
    timeDimId: 'Tid',
    contentsDimId: 'ContentsCode',
    valueCode: 'Tolvmanedersendring', // 12-month rate (per cent)
    fixedDims: { VareTjenesteGrp: '00' }, // total CPI
    description: 'Consumer Price Index 12-month rate (2025=100 base)',
  },

  'gdp-growth': {
    source: 'ssb',
    id: 'gdp-growth',
    label: 'GDP Growth',
    unit: '% (YoY, seasonally adj.)',
    frequency: 'quarterly',
    category: 'growth',
    tableId: '09190',
    timeDimId: 'Tid',
    contentsDimId: 'ContentsCode',
    valueCode: 'Volum', // change in volume from same period previous year (%)
    fixedDims: { Makrost: 'bnpb.nr23_9fn' }, // GDP Mainland Norway, market values
    description: 'Gross domestic product Mainland Norway, volume change YoY',
  },

  unemployment: {
    source: 'ssb',
    id: 'unemployment',
    label: 'Unemployment Rate',
    unit: '% (LFS)',
    frequency: 'quarterly',
    category: 'labor',
    tableId: '14483',
    timeDimId: 'Tid',
    contentsDimId: 'ContentsCode',
    valueCode: 'ArbledProsArbstyrk', // unemployment rate (LFS)
    fixedDims: {
      Kjonn: '0', // both sexes
      Alder: '15-74', // standard working-age population
      Justering: 'S', // seasonally adjusted
    },
    description: 'Labour Force Survey unemployment rate, age 15-74, seasonally adjusted',
  },

  wages: {
    source: 'ssb',
    id: 'wages',
    label: 'Wage Growth',
    unit: '% (YoY)',
    frequency: 'annual',
    category: 'labor',
    tableId: '09174',
    timeDimId: 'Tid',
    contentsDimId: 'ContentsCode',
    valueCode: 'LonnProsent', // wages and salaries, change from previous year (%)
    fixedDims: { NACE: 'nr23_6' }, // total industry
    description: 'Wages and salaries, annual change from previous year, total industry',
  },

  'house-prices': {
    source: 'ssb',
    id: 'house-prices',
    label: 'House Price Index',
    unit: 'Index (2015=100)',
    frequency: 'quarterly',
    category: 'prices',
    tableId: '07221',
    timeDimId: 'Tid',
    contentsDimId: 'ContentsCode',
    valueCode: 'Boligindeks', // price index for existing dwellings
    fixedDims: {
      Region: 'TOTAL', // all Norway
      Boligtype: '00', // all dwelling types
    },
    description: 'Price index for existing dwellings, all Norway, all types',
  },
}

export const dashboardSeriesIds: string[] = [
  'policy-rate',
  'eur-nok',
  'usd-nok',
  'cpi',
  'gdp-growth',
  'unemployment',
  'wages',
  'house-prices',
]
