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

import { IPokemonsStatisticV2 } from "../../../../../models/mongo-models/pokemons-statistic-v2"
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
  // Sort by value (descending for count, ascending for rank)
  const sorted = [...payload].sort((a, b) =>
    metric === "count" ? b.value - a.value : a.value - b.value
  )
  return (
    <div className="pokemon-history-tooltip">
      <div className="pokemon-history-tooltip-date">{label}</div>
      {sorted.slice(0, 10).map((entry: any) => (
        <div key={entry.name} className="pokemon-history-tooltip-row">
          <img
            src={getPokemonPortraitPath(entry.name)}
            width={20}
            height={20}
            style={{ borderRadius: "50%" }}
          />
          <span style={{ color: entry.color }}>{t(`pkm.${entry.name}`)}</span>
          <span>{entry.value?.toFixed(2)}</span>
        </div>
      ))}
      {sorted.length > 10 && (
        <div className="pokemon-history-tooltip-more">
          +{sorted.length - 10} more
        </div>
      )}
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
      .slice(0, 200)

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
    names.forEach((n) => {
      let hash = 0
      for (let i = 0; i < n.length; i++) {
        hash = n.charCodeAt(i) + ((hash << 5) - hash)
      }
      const hue = ((hash % 360) + 360) % 360
      cMap[n] = `hsl(${hue}, 70%, 55%)`
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
    selectedPkm
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

  return (
    <div id="pokemon-history-panel">
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
            {pokemonNames.map((name) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={colorMap[name]}
                strokeWidth={1.5}
                dot={
                  <PortraitEndDot
                    dataLength={data.length}
                    size={24}
                    clipId={`clip-panel-${name}`}
                    imageSrc={getPokemonPortraitPath(name)}
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
