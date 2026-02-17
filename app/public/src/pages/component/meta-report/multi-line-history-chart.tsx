import React from "react"
import { useTranslation } from "react-i18next"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { IHistoryEntry } from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { formatDateShort } from "./history-utils"
import "./history-chart.css"

export interface HistorySeries {
  name: Pkm
  entries: IHistoryEntry[]
}

function getPokemonPortraitPath(pokemonName: string): string {
  return getPortraitSrc(PkmIndex[pokemonName as Pkm])
}

function getColorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = ((hash % 360) + 360) % 360
  return `hsl(${hue}, 70%, 55%)`
}

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

/** Multi-line chart showing one line per pokemon with portrait at end of line */
export function MultiLineHistoryChart(props: {
  series: HistorySeries[]
  label?: string
  invertY?: boolean
  height?: number
}) {
  const { series, label, invertY = false, height = 90 } = props
  const { t } = useTranslation()

  const validSeries = series.filter((s) => s.entries.length >= 2)
  if (validSeries.length === 0) return null

  const allDates = new Set<string>()
  for (const s of validSeries) {
    for (const e of s.entries) allDates.add(e.date)
  }
  const sortedDates = Array.from(allDates).sort()

  const seriesMaps = new Map(
    validSeries.map((s) => [
      s.name,
      new Map(s.entries.map((e) => [e.date, e.value]))
    ])
  )

  const data = sortedDates.map((date) => {
    const point: Record<string, any> = {
      date,
      dateLabel: formatDateShort(date)
    }
    for (const s of validSeries) {
      const value = seriesMaps.get(s.name)?.get(date)
      if (value !== undefined) point[s.name] = invertY ? -value : value
    }
    return point
  })

  return (
    <div className="history-chart">
      {label && <span className="history-chart-label">{t(label)}</span>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 9, fill: "#999" }}
            tickLine={false}
            axisLine={false}
            interval={"preserveStartEnd"}
          />
          {validSeries.map((s) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={getColorForName(s.name)}
              strokeWidth={1.5}
              dot={
                <PortraitEndDot
                  dataLength={data.length}
                  size={16}
                  clipId={`clip-inline-${s.name}-${label || ""}`}
                  imageSrc={getPokemonPortraitPath(s.name)}
                />
              }
              isAnimationActive={false}
            />
          ))}
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div
                  className="sparkline-tooltip"
                  style={{ flexDirection: "column" }}
                >
                  <span>{payload[0]?.payload?.date}</span>
                  {payload.map((p: any) => (
                    <div
                      key={p.name}
                      style={{
                        color: p.color,
                        display: "flex",
                        gap: "4px",
                        alignItems: "center"
                      }}
                    >
                      <img
                        src={getPokemonPortraitPath(p.name)}
                        width={14}
                        height={14}
                        style={{ borderRadius: "50%" }}
                      />
                      <span>{t(`pkm.${p.name}`)}</span>
                      <strong>
                        {(invertY ? -p.value : p.value)?.toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
