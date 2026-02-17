import { t } from "i18next"
import { useMemo } from "react"
import "./item-distribution.css"
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { IItemsStatisticV2 } from "../../../../../models/mongo-models/items-statistic-v2"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Item } from "../../../../../types/enum/Item"

function getItemImagePath(itemName: string): string {
  return `assets/item/${itemName}.png`
}

function CustomTooltip({
  active,
  payload
}: {
  active?: boolean
  payload?: any[]
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="item-distribution-tooltip">
        <div className="item-distribution-tooltip-header">
          <img src={getItemImagePath(data.name)} alt={data.name} />
          <span>{t(`item.${data.name}`)}</span>
        </div>
        <div className="item-distribution-tooltip-row">
          <label className="item-distribution-tooltip-label">
            {t("average_place")}:
          </label>
          <span>{data.avgPlace?.toFixed(2)}</span>
        </div>
        <div className="item-distribution-tooltip-row">
          <label className="item-distribution-tooltip-label">
            {t("count")}:
          </label>
          <span>{data.count}</span>
        </div>
      </div>
    )
  }
  return null
}

interface ItemScatterPointProps {
  cx?: number
  cy?: number
  fill?: string
  payload?: any
}

function ItemScatterPoint({ cx = 0, cy = 0, payload }: ItemScatterPointProps) {
  const size = 32
  return (
    <g>
      <image
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        href={getItemImagePath(payload?.name || "")}
      />
    </g>
  )
}

interface ItemDistributionProps {
  metaItems: IItemsStatisticV2[]
  eloThreshold: EloRank
  loading: boolean
  itemFilter?: readonly Item[]
}

export function ItemDistribution({
  metaItems,
  eloThreshold,
  loading,
  itemFilter
}: ItemDistributionProps) {
  const scatterData = useMemo(() => {
    const tierData = metaItems.find((i) => i.tier === eloThreshold)
    if (!tierData) return []

    // Map every item to scatter plot coordinates
    let items = Object.values(tierData.items).map((item) => ({
      avgPlace: item.rank,
      count: item.count,
      name: item.name
    }))

    // Filter by item type if specified
    if (itemFilter && itemFilter.length > 0) {
      items = items.filter((item) => itemFilter.includes(item.name as Item))
    }

    return items.sort((a, b) => b.count - a.count).slice(0, 400)
  }, [metaItems, eloThreshold, itemFilter])

  const xAxisDomain = useMemo(() => {
    if (scatterData.length === 0) return [0, 8]
    const avgPlaces = scatterData.map((item) => item.avgPlace)
    const min = Math.min(...avgPlaces)
    const max = Math.max(...avgPlaces)
    return [Math.max(0, min - 0.1), max + 0.1]
  }, [scatterData])

  return (
    <div id="item-distribution">
      {scatterData.length === 0 ? (
        <p>{loading ? t("loading") : t("no_data_available")}</p>
      ) : (
        <ResponsiveContainer width="100%" height="95%">
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="avgPlace"
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
              name="Items"
              data={scatterData}
              fill="#82ca9d"
              shape={<ItemScatterPoint />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
