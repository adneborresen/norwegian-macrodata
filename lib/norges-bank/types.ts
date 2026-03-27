// Norges Bank Open Data API returns SDMX-JSON in series-level format.
//
// Structure:
//   data.structure.dimensions.series   = non-time dimensions (FREQ, INSTRUMENT_TYPE, …)
//   data.structure.dimensions.observation = [TIME_PERIOD]
//   data.dataSets[0].series = {
//     "0:0:0:0": {
//       observations: {
//         "0": ["2.75"],   ← index into TIME_PERIOD.values; value is a string
//         "1": ["2.75"],
//       }
//     }
//   }

export interface SdmxDimensionValue {
  id: string
  name: string
  start?: string
  end?: string
}

export interface SdmxDimension {
  id: string
  name: string
  values: SdmxDimensionValue[]
}

export interface SdmxSeries {
  attributes: unknown[]
  observations: Record<string, [string | null, ...unknown[]]>
}

export interface SdmxJsonMessage {
  data: {
    structure: {
      dimensions: {
        series: SdmxDimension[]
        observation: SdmxDimension[] // always [TIME_PERIOD]
      }
    }
    dataSets: Array<{
      series: Record<string, SdmxSeries>
    }>
  }
}
