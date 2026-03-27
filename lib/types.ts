// ─── Unified data model ────────────────────────────────────────────────────────

export interface DataPoint {
  date: string // "2024-01-01" | "2024-01" | "2024-Q1" | "2024K1" | "2024"
  value: number | null // null = unavailable / confidential
  status?: string // SSB status codes: ":" not available, ".." not applicable
}

export interface SeriesMetadata {
  id: string // internal slug: "cpi" | "policy-rate"
  label: string // "Consumer Price Index"
  unit: string // "%" | "Index (2015=100)" | "NOK/EUR"
  frequency: 'annual' | 'quarterly' | 'monthly' | 'daily'
  source: 'ssb' | 'norges-bank'
  sourceId: string // "14700" for SSB; "IR/B.KPRA.SD." for Norges Bank
  category: string // "prices" | "labor" | "monetary" | "growth" | "external"
  description?: string
  lastValue: number | null
  lastDate: string
  previousValue: number | null
  updatedAt?: string // ISO datetime from upstream
}

export interface TimeSeries {
  metadata: SeriesMetadata
  data: DataPoint[]
}

// ─── Forecast bridge (Phase 6) ────────────────────────────────────────────────

export interface ForecastPayload {
  series: string // "yield-curve"
  period: string // "2026-03" (YYYY-MM)
  generatedAt: string // ISO datetime
  model: string // "dns" | "ar1" | "linear-regression"
  horizon: number // months ahead
  data: DataPoint[]
  confidence?: {
    lower: DataPoint[]
    upper: DataPoint[]
  }
}

// ─── Series config (internal registry) ────────────────────────────────────────

export interface NorgesBankSeriesConfig {
  source: 'norges-bank'
  id: string
  label: string
  unit: string
  frequency: SeriesMetadata['frequency']
  category: string
  dataflow: string // "IR" | "EXR"
  key: string // "B.KPRA.SD." — KEY segment of the API URL
  description?: string
}

export interface SsbSeriesConfig {
  source: 'ssb'
  id: string
  label: string
  unit: string
  frequency: SeriesMetadata['frequency']
  category: string
  tableId: string // "14700"
  timeDimId: string // usually "Tid"
  contentsDimId: string // usually "ContentsCode"
  valueCode: string // e.g. "KpiIndMnd"
  fixedDims: Record<string, string> // e.g. { VareTjenesteGrp: "00" }
  description?: string
}

export type SeriesConfig = NorgesBankSeriesConfig | SsbSeriesConfig
