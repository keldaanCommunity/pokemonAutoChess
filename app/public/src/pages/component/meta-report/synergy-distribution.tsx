import { t } from "i18next"
import { useMemo } from "react"
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import type { EloRank } from "../../../../../types/enum/EloRank"
import type { Synergy } from "../../../../../types/enum/Synergy"
import type { ITypeStatistics } from "../../../../../types/meta"
import "./synergy-distribution.css"

function getSynergyImagePath(synergyName: string): string {
  return `assets/types/${synergyName}.svg`
}

type ValueType = {
  average_rank: number
  count: number
  name: Synergy
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ValueType }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="synergy-distribution-tooltip">
        <div className="synergy-distribution-tooltip-header">
          <img src={getSynergyImagePath(data.name)} alt={data.name} />
          <span>{t(`synergy.${data.name}`)}</span>
        </div>
        <div className="synergy-distribution-tooltip-row">
          <label className="synergy-distribution-tooltip-label">
            {t("meta_report.average_place")}:
          </label>
          <span>{data.average_rank?.toFixed(2)}</span>
        </div>
        <div className="synergy-distribution-tooltip-row">
          <label className="synergy-distribution-tooltip-label">
            {t("meta_report.count")}:
          </label>
          <span>{data.count}</span>
        </div>
      </div>
    )
  }
  return null
}

interface SynergyScatterPointProps {
  cx?: number
  cy?: number
  fill?: string
  payload?: any
}

function SynergyScatterPoint({
  cx = 0,
  cy = 0,
  payload
}: SynergyScatterPointProps) {
  const size = 32
  return (
    <g>
      <image
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        href={getSynergyImagePath(payload?.name || "")}
      />
    </g>
  )
}

interface SynergyDistributionProps {
  metaTypes?: ITypeStatistics
  eloThreshold: EloRank
  loading: boolean
}

export function SynergyDistribution({
  metaTypes,
  eloThreshold,
  loading
}: SynergyDistributionProps) {
  const scatterData = useMemo(() => {
    if (!metaTypes || !metaTypes[eloThreshold]) return []

    // Map every synergy to scatter plot coordinates
    const synergies: ValueType[] = Object.entries(metaTypes[eloThreshold]).map(
      ([synergyName, data]) => ({
        average_rank: data.average_rank,
        count: data.count,
        name: synergyName as Synergy
      })
    )

    return synergies
      .filter((synergy) => synergy.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 400)
  }, [metaTypes, eloThreshold])

  const xAxisDomain = useMemo(() => {
    if (scatterData.length === 0) return [0, 8]
    const averageRanks = scatterData.map((synergy) => synergy.average_rank)
    const min = Math.min(...averageRanks)
    const max = Math.max(...averageRanks)
    return [Math.max(0, min - 0.1), max + 0.1]
  }, [scatterData])

  return (
    <div id="synergy-distribution">
      {scatterData.length === 0 ? (
        <p>{loading ? t("loading") : t("no_data_available")}</p>
      ) : (
        <ResponsiveContainer width="100%" height="95%">
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="average_rank"
              domain={xAxisDomain}
              tickFormatter={(value) => value.toFixed(2)}
              tick={{ fill: "#ddd", fontSize: 12 }}
              label={{
                value: "Average Place",
                position: "insideBottomRight",
                offset: -5,
                fill: "#ddd"
              }}
            />
            <YAxis
              dataKey="count"
              tick={{ fill: "#ddd", fontSize: 12 }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                fill: "#ddd"
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
              animationDuration={0}
            />
            <Scatter
              name="Synergies"
              data={scatterData}
              fill="#82ca9d"
              shape={<SynergyScatterPoint />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
