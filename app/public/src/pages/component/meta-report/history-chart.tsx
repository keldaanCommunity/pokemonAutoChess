import React from "react"
import { useTranslation } from "react-i18next"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { IHistoryEntry } from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { formatDateShort } from "./history-utils"
import "./history-chart.css"

/** Full-width chart with label, for use inside expanded accordion sections */
export function HistoryChart(props: {
  entries: IHistoryEntry[]
  label?: string
  color?: string
  invertY?: boolean
}) {
  const { t } = useTranslation()
  const {
    entries: rawEntries,
    label,
    color = "#8884d8",
    invertY = false
  } = props

  const entries = rawEntries
  if (!entries || entries.length < 2) return null

  const data = entries.map((e) => ({
    date: e.date,
    dateLabel: formatDateShort(e.date),
    value: invertY ? -e.value : e.value
  }))

  return (
    <div className="history-chart">
      {label && <span className="history-chart-label">{t(label)}</span>}
      <ResponsiveContainer width="100%" height={90}>
        <LineChart data={data}>
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 9, fill: "#999" }}
            tickLine={false}
            axisLine={false}
            interval={"preserveStartEnd"}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              const displayValue = invertY ? -d.value : d.value
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
