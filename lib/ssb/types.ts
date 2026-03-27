// SSB StatBank PxWebApi v2 returns json-stat2 (version 2.0).
// https://json-stat.org/format/
//
// Values are stored as a flat array in row-major order indexed against
// dimension categories. Null entries indicate unavailable or confidential data.

interface JsonStat2DimensionCategory {
  index: Record<string, number>
  label?: Record<string, string>
}

export interface JsonStat2Dimension {
  label: string
  category: JsonStat2DimensionCategory
}

export interface JsonStat2Dataset {
  version: '2.0'
  class: 'dataset'
  label?: string
  source?: string
  updated?: string
  note?: string[]
  id: string[]
  size: number[]
  role?: {
    time?: string[]
    metric?: string[]
  }
  dimension: Record<string, JsonStat2Dimension>
  value: Array<number | null>
  status?: Record<string, string>
}
