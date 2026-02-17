import { t } from "i18next"
import React, { useMemo } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

import { IItemsStatisticV2 } from "../../../../../models/mongo-models/items-statistic-v2"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Item } from "../../../../../types/enum/Item"
import { formatDateShort } from "./history-utils"
import "./item-history-panel.css"

function getItemImagePath(itemName: string): string {
  return `assets/item/${itemName}.png`
}

function getColorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = ((hash % 360) + 360) % 360
  return `hsl(${hue}, 70%, 55%)`
}

const ImageEndDot = React.memo(function ImageEndDot(props: {
  dataLength: number
  size: number
  imageSrc: string
  cx?: number
  cy?: number
  index?: number
  [key: string]: any
}) {
  const { dataLength, size, imageSrc, cx = 0, cy = 0, index = 0 } = props
  if (index !== dataLength - 1) return <circle r={0} />
  return (
    <g>
      <image
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        href={imageSrc}
      />
    </g>
  )
})

interface ItemHistoryPanelProps {
  metaItems: IItemsStatisticV2[]
  eloThreshold: EloRank
  loading: boolean
  metric: "count" | "rank"
  itemFilter?: readonly Item[]
}

function CustomTooltip({
  active,
  payload,
  label,
  metric
}: {
  active?: boolean
  payload?: any[]
  label?: string
  metric: "count" | "rank"
}) {
  if (!active || !payload?.length) return null
  const sorted = [...payload].sort((a, b) =>
    metric === "count" ? b.value - a.value : a.value - b.value
  )
  return (
    <div className="item-history-tooltip">
      <div className="item-history-tooltip-date">{label}</div>
      {sorted.slice(0, 10).map((entry: any) => (
        <div key={entry.name} className="item-history-tooltip-row">
          <img src={getItemImagePath(entry.name)} width={20} height={20} />
          <span style={{ color: entry.color }}>{t(`item.${entry.name}`)}</span>
          <span>{entry.value?.toFixed(2)}</span>
        </div>
      ))}
      {sorted.length > 10 && (
        <div className="item-history-tooltip-more">
          +{sorted.length - 10} more
        </div>
      )}
    </div>
  )
}

export function ItemHistoryPanel({
  metaItems,
  eloThreshold,
  loading,
  metric,
  itemFilter
}: ItemHistoryPanelProps) {
  const { data, itemNames, colorMap } = useMemo(() => {
    const tierData = metaItems.find((i) => i.tier === eloThreshold)
    if (!tierData) return { data: [], itemNames: [], colorMap: {} }

    let items = Object.values(tierData.items).filter((item) => item.count > 0)

    if (itemFilter && itemFilter.length > 0) {
      items = items.filter((item) => itemFilter.includes(item.name as Item))
    }

    items = items
      .sort((a, b) =>
        metric === "count" ? b.count - a.count : a.rank - b.rank
      )
      .slice(0, 200)

    const allDates = new Set<string>()
    const validItems: {
      name: string
      history: { date: string; value: number }[]
    }[] = []

    for (const item of items) {
      const rawHistory =
        metric === "count"
          ? (item.count_history ?? [])
          : (item.rank_history ?? [])

      if (rawHistory.length < 2) continue
      validItems.push({ name: item.name, history: rawHistory })
      for (const entry of rawHistory) {
        allDates.add(entry.date)
      }
    }

    const sortedDates = Array.from(allDates).sort()
    const names = validItems.map((i) => i.name)
    const cMap: Record<string, string> = {}
    names.forEach((n) => {
      cMap[n] = getColorForName(n)
    })

    const historyMaps = new Map(
      validItems.map((item) => [
        item.name,
        new Map(item.history.map((e) => [e.date, e.value]))
      ])
    )

    const chartData = sortedDates.map((date) => {
      const point: Record<string, any> = {
        date,
        dateLabel: formatDateShort(date)
      }
      for (const item of validItems) {
        const value = historyMaps.get(item.name)?.get(date)
        if (value !== undefined) point[item.name] = value
      }
      return point
    })

    return { data: chartData, itemNames: names, colorMap: cMap }
  }, [metaItems, eloThreshold, metric, itemFilter])

  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 8]
    const allValues: number[] = []
    for (const point of data) {
      for (const key of Object.keys(point)) {
        if (
          key !== "date" &&
          key !== "dateLabel" &&
          typeof point[key] === "number"
        ) {
          allValues.push(point[key])
        }
      }
    }
    if (allValues.length === 0) return [0, 8]
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const padding = (max - min) * 0.05 || 0.5
    return [Math.max(0, min - padding), max + padding]
  }, [data])

  const yLabel = metric === "count" ? t("count") : t("average_place")
  const invertY = metric === "rank"

  return (
    <div id="item-history-panel">
      {data.length === 0 ? (
        <p>{loading ? t("loading") : t("no_data_available")}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: "#ddd", fontSize: 10 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#ddd", fontSize: 10 }}
              domain={yDomain}
              label={{
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                fill: "#ddd",
                fontSize: 11
              }}
              width={40}
              reversed={invertY}
            />
            <Tooltip
              content={<CustomTooltip metric={metric} />}
              wrapperStyle={{ outline: "none" }}
              animationDuration={0}
            />
            {itemNames.map((name) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={colorMap[name]}
                strokeWidth={1.5}
                dot={
                  <ImageEndDot
                    dataLength={data.length}
                    size={24}
                    imageSrc={getItemImagePath(name)}
                  />
                }
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
