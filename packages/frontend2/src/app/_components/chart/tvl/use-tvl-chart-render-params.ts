import { type Milestone } from '@l2beat/config'
import { useCallback, useMemo } from 'react'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { formatCurrency } from '~/utils/format'
import { type SeriesStyle } from '../core/styles'
import { mapMilestones } from '../utils/map-milestones'

export type TvlDataPoint = readonly [number, number, number, number, number]

interface Params {
  milestones: Milestone[]
  unit: 'usd' | 'eth'
  data?: TvlDataPoint[]
}

export function useTvlChartRenderParams({ milestones, unit, data }: Params) {
  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) =>
      formatCurrency(value, unit, { showLessThanMinimum: false }),
    [unit],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp] = dataPoint
        const { values, data } = getChartValues(dataPoint, unit)
        const milestone = mappedMilestones[timestamp]

        return {
          values,
          data,
          milestone,
        }
      }) ?? [],
    [data, mappedMilestones, unit],
  )

  const firstValue = useMemo(() => columns[0]?.values[0]?.value, [columns])
  const lastValue = useMemo(
    () => columns[columns.length - 1]?.values[0]!.value ?? undefined,
    [columns],
  )
  const change = useMemo(
    () => (lastValue && firstValue ? lastValue / firstValue - 1 : undefined),
    [firstValue, lastValue],
  )

  const chartRange: [number, number] = useMemo(
    () => [data?.[0]?.[0] ?? 0, data?.[data.length - 1]?.[0] ?? 1],
    [data],
  )

  const valuesStyle: SeriesStyle[] = useMemo(
    () => [
      {
        fill: 'signature gradient',
        line: 'signature gradient',
        point: 'circle',
      },
    ],
    [],
  )

  return {
    change,
    columns,
    lastValue,
    chartRange,
    valuesStyle,
    formatYAxisLabel,
  }
}

function getChartValues(dataPoint: TvlDataPoint, unit: CostsUnit) {
  const [timestamp, canonical, external, native, ethPrice] = dataPoint
  const usdSum = canonical + external + native
  const usdValue = usdSum / 100
  const ethValue = usdSum / ethPrice

  return {
    values: [{ value: unit === 'usd' ? usdValue : ethValue }],
    data: {
      timestamp,
      usdValue,
      ethValue,
    },
  }
}
