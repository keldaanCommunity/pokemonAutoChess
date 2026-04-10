import React from "react"
import { useTranslation } from "react-i18next"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { IHistoryEntry } from "../../../models/pokemons-statistic-v2"
import { formatDateShort } from "./history-utils"
import "./history-chart.css"

const PortraitEndDot = React.memo(function PortraitEndDot(props: {
  dataLength: number
  size: number
  clipId: string
  imageSrc: string
  cx?: number
  cy?: number
  index?: number
  [key: string]: any
}) {
  const {
    dataLength,
    size,
    clipId,
    imageSrc,
    cx = 0,
    cy = 0,
    index = 0
  } = props
  if (index !== dataLength - 1) return <circle r={0} />
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={size / 2} />
        </clipPath>
      </defs>
      <image
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        href={imageSrc}
        clipPath={`url(#${clipId})`}
      />
    </g>
  )
})

/** Full-width chart with label, for use inside expanded accordion sections */
export function HistoryChart(props: {
  entries: IHistoryEntry[]
  label?: string
  color?: string
  invertY?: boolean
  portraitSrc?: string
}) {
  const { t } = useTranslation()
  const chartId = React.useId()
  const {
    entries: rawEntries,
    label,
    color = "#8884d8",
    invertY = false,
    portraitSrc
  } = props

  const entries = rawEntries
  if (!entries || entries.length < 2) return null

  const data = entries.map((e) => ({
    date: e.date,
    dateLabel: formatDateShort(e.date),
    value: e.value
  }))

  return (
    <div className="history-chart">
      {label && <span className="history-chart-label">{t(label)}</span>}
      <ResponsiveContainer width="100%" height={150}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 14, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#b8b8b8"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 9, fill: "#b8b8b8" }}
            tickLine={false}
            axisLine={false}
            interval={"preserveStartEnd"}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            reversed={invertY}
            tick={{ fontSize: 9, fill: "#b8b8b8" }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v: number) =>
              Number.isInteger(v) ? v.toString() : v.toFixed(1)
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={
              portraitSrc ? (
                <PortraitEndDot
                  dataLength={data.length}
                  size={20}
                  clipId={`clip-${chartId}`}
                  imageSrc={portraitSrc}
                />
              ) : (
                false
              )
            }
            connectNulls
            isAnimationActive={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              const displayValue = d.value
              return (
                <div className="sparkline-tooltip">
                  <span>{d.date}</span>
                  <strong>
                    {typeof displayValue === "number"
                      ? displayValue.toFixed(2)
                      : displayValue}
                  </strong>
                </div>
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
