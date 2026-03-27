import type { DataPoint } from '@/lib/types'
import type { SdmxJsonMessage } from './types'

/**
 * Transform a Norges Bank SDMX-JSON response into a flat DataPoint array.
 *
 * Norges Bank uses the series-level SDMX-JSON format:
 * - TIME_PERIOD is the sole observation-level dimension
 * - Observation keys are integer strings (index into TIME_PERIOD.values)
 * - Values are strings and must be parsed with parseFloat
 */
export function transformSdmxJson(raw: SdmxJsonMessage): DataPoint[] {
  const timePeriodDim = raw.data.structure.dimensions.observation[0]
  const result: DataPoint[] = []

  const dataSet = raw.data.dataSets[0]
  if (!timePeriodDim || !dataSet) return result

  for (const series of Object.values(dataSet.series)) {
    for (const [key, obs] of Object.entries(series.observations)) {
      const date = timePeriodDim.values[parseInt(key, 10)]?.id
      if (date === undefined) continue

      const rawVal = obs[0]
      const value =
        rawVal !== null && rawVal !== undefined ? parseFloat(String(rawVal)) : null

      result.push({ date, value: isNaN(value ?? NaN) ? null : value })
    }
  }

  return result.sort((a, b) => a.date.localeCompare(b.date))
}
