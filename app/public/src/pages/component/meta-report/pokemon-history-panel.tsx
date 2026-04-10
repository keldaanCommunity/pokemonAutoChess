import { t } from "i18next"
import React, { useCallback, useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

import { IPokemonsStatisticV2 } from "../../../models/pokemons-statistic-v2"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { formatDateShort } from "./history-utils"
import "./pokemon-history-panel.css"

const TOP_N_OPTIONS = [10, 20, 50] as const

const PALETTE = [
  "#e6194b",
  "#3cb44b",
  "#4363d8",
  "#f58231",
  "#42d4f4",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ff4500",
  "#1e90ff"
]

function getPokemonPortraitPath(pokemonName: string): string {
  return getPortraitSrc(PkmIndex[pokemonName as Pkm])
}

function isInPool(pokemonName: Pkm, pool: string): boolean {
  if (pool === "all") return true
  const data = getPokemonData(pokemonName)
  if (pool === "special") return data.rarity === Rarity.SPECIAL
  if (pool === "additional") return data.additional
  if (pool === "regional") return data.regional
  if (pool === "regular")
    return !data.additional && !data.regional && data.rarity !== Rarity.SPECIAL
  return false
}

function hasType(pokemonName: Pkm, synergy: Synergy | "all"): boolean {
  if (synergy === "all") return true
  return PRECOMPUTED_POKEMONS_PER_TYPE[synergy].includes(pokemonName)
}

function hasRarity(pokemonName: Pkm, rarity: Rarity | "all"): boolean {
  if (rarity === "all") return true
  return PRECOMPUTED_POKEMONS_PER_RARITY[rarity].includes(pokemonName)
}

function isCorrectTier(pokemonName: Pkm, tier: string): boolean {
  if (tier === "all") return true
  return getPokemonData(pokemonName).stars?.toString() === tier
}

function formatYTick(value: number, metric: "count" | "rank"): string {
  if (metric === "count") {
    if (value >= 1000) return (value / 1000).toFixed(1) + "k"
    return Math.round(value).toString()
  }
  return value.toFixed(1)
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

interface PokemonHistoryPanelProps {
  metaPokemons: IPokemonsStatisticV2[]
  eloThreshold: EloRank
  loading: boolean
  metric: "count" | "rank"
  synergy?: Synergy | "all"
  rarity?: Rarity | "all"
  pool?: string
  tier?: string
  selectedPkm?: Pkm | ""
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
    <div className="pokemon-history-tooltip">
      <div className="pokemon-history-tooltip-date">{label}</div>
      {sorted.map((entry: any) => (
        <div key={entry.name} className="pokemon-history-tooltip-row">
          <img
            src={getPokemonPortraitPath(entry.name)}
            width={20}
            height={20}
            style={{ borderRadius: "50%" }}
          />
          <span style={{ color: entry.stroke || entry.color }}>
            {t(`pkm.${entry.name}`)}
          </span>
          <span>
            {metric === "count"
              ? Math.round(entry.value)
              : entry.value?.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function PokemonHistoryPanel({
  metaPokemons,
  eloThreshold,
  loading,
  metric,
  synergy = "all",
  rarity = "all",
  pool = "all",
  tier = "all",
  selectedPkm = ""
}: PokemonHistoryPanelProps) {
  const [topN, setTopN] = useState<number>(50)
  const [hoveredLine, setHoveredLine] = useState<string | null>(null)

  const { data, pokemonNames, colorMap } = useMemo(() => {
    const tierData = metaPokemons.find((i) => i.tier === eloThreshold)
    if (!tierData) return { data: [], pokemonNames: [], colorMap: {} }

    const pokemons = Object.values(tierData.pokemons)
      .filter((pokemon) => {
        if (pokemon.count === 0) return false
        if (selectedPkm !== "" && pokemon.name !== selectedPkm) return false
        if (!hasType(pokemon.name as Pkm, synergy)) return false
        if (!hasRarity(pokemon.name as Pkm, rarity)) return false
        if (!isInPool(pokemon.name as Pkm, pool)) return false
        if (!isCorrectTier(pokemon.name as Pkm, tier)) return false
        return true
      })
      .sort((a, b) =>
        metric === "count" ? b.count - a.count : a.rank - b.rank
      )
      .slice(0, topN)

    const allDates = new Set<string>()
    const validPokemons: {
      name: string
      history: { date: string; value: number }[]
    }[] = []

    for (const pokemon of pokemons) {
      const rawHistory =
        metric === "count"
          ? (pokemon.count_history ?? [])
          : (pokemon.rank_history ?? [])

      if (rawHistory.length < 2) continue
      validPokemons.push({ name: pokemon.name, history: rawHistory })
      for (const entry of rawHistory) {
        allDates.add(entry.date)
      }
    }

    const sortedDates = Array.from(allDates).sort()
    const names = validPokemons.map((p) => p.name)
    const cMap: Record<string, string> = {}
    names.forEach((n, i) => {
      cMap[n] = PALETTE[i % PALETTE.length]
    })

    const historyMaps = new Map(
      validPokemons.map((p) => [
        p.name,
        new Map(p.history.map((e) => [e.date, e.value]))
      ])
    )

    const chartData = sortedDates.map((date) => {
      const point: Record<string, any> = {
        date,
        dateLabel: formatDateShort(date)
      }
      for (const p of validPokemons) {
        const value = historyMaps.get(p.name)?.get(date)
        if (value !== undefined) point[p.name] = value
      }
      return point
    })

    return { data: chartData, pokemonNames: names, colorMap: cMap }
  }, [
    metaPokemons,
    eloThreshold,
    metric,
    synergy,
    rarity,
    pool,
    tier,
    selectedPkm,
    topN
  ])

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
  const showPortraits = pokemonNames.length <= 15

  const handleLegendEnter = useCallback((name: string) => {
    setHoveredLine(name)
  }, [])
  const handleLegendLeave = useCallback(() => {
    setHoveredLine(null)
  }, [])

  return (
    <div id="pokemon-history-panel">
      <div className="pokemon-history-controls">
        <label>{t("top")}:</label>
        {TOP_N_OPTIONS.map((n) => (
          <button
            key={n}
            className={`bubbly pokemon-history-topn-btn${topN === n ? " active" : ""}`}
            onClick={() => setTopN(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {data.length === 0 ? (
        <p>{loading ? t("loading") : t("no_data_available")}</p>
      ) : (
        <div className="pokemon-history-body">
          <div className="pokemon-history-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 12,
                  right: showPortraits ? 16 : 10,
                  left: 0,
                  bottom: 30
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#b8b8b8"
                  strokeOpacity={0.5}
                />
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
                  width={45}
                  reversed={invertY}
                  tickFormatter={(v: number) => formatYTick(v, metric)}
                />
                <Tooltip
                  content={<CustomTooltip metric={metric} />}
                  wrapperStyle={{ outline: "none" }}
                  animationDuration={0}
                />
                {pokemonNames.map((name, i) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={colorMap[name]}
                    strokeWidth={hoveredLine === name ? 3 : i < 5 ? 2.5 : 1.5}
                    strokeOpacity={
                      hoveredLine == null ? 1 : hoveredLine === name ? 1 : 0.15
                    }
                    dot={
                      showPortraits ? (
                        <PortraitEndDot
                          dataLength={data.length}
                          size={24}
                          clipId={`clip-panel-${name}-${metric}`}
                          imageSrc={getPokemonPortraitPath(name)}
                        />
                      ) : (
                        false
                      )
                    }
                    connectNulls
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="pokemon-history-legend">
            {pokemonNames.map((name) => (
              <div
                key={name}
                className={`pokemon-history-legend-item${hoveredLine === name ? " highlighted" : ""}`}
                onMouseEnter={() => handleLegendEnter(name)}
                onMouseLeave={handleLegendLeave}
              >
                <span
                  className="pokemon-history-legend-color"
                  style={{ background: colorMap[name] }}
                />
                <img
                  src={getPokemonPortraitPath(name)}
                  width={16}
                  height={16}
                  style={{ borderRadius: "50%" }}
                />
                <span className="pokemon-history-legend-name">
                  {t(`pkm.${name}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
