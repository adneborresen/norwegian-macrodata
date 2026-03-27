// Minimal type shim for jsonstat-toolkit (no official @types package).
// https://github.com/jsonstat/toolkit

declare module 'jsonstat-toolkit' {
  interface JStatCategory {
    id: string | null
    label: string | null
    index: number
  }

  interface JStatDimension {
    length: number
    id: string | null
    label: string | null
    role: string | null
    Category(indexOrId: number | string): JStatCategory
  }

  interface JDataPoint {
    value: number | null
    status: string | null
  }

  interface JStatDataset {
    id: string[]
    size: number[]
    length: number
    label: string | null
    role: { time?: string[]; metric?: string[] } | null
    Dimension(indexOrId: number | string): JStatDimension
    Data(coords: Record<string, string> | number | number[]): JDataPoint | null
    Dice(filter: Record<string, string[]>): JStatDataset
    Transform(type: string): unknown
  }

  interface JStatCollection {
    Dataset(indexOrId: number | string): JStatDataset
  }

  function JSONstat(data: unknown): JStatCollection
  export default JSONstat
}
