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

import { IPokemonsStatisticV2 } from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../../../utils/avatar"
import "./pokemon-distribution.css"

function getPokemonPortraitPath(pokemonName: string): string {
  return getPortraitSrc(PkmIndex[pokemonName as Pkm])
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
      <div className="pokemon-distribution-tooltip">
        <div className="pokemon-distribution-tooltip-header">
          <img src={getPokemonPortraitPath(data.name)} alt={data.name} />
          <span>{t(`pkm.${data.name}`)}</span>
        </div>
        <div className="pokemon-distribution-tooltip-row">
          <label className="pokemon-distribution-tooltip-label">
            {t("average_place")}:
          </label>
          <span>{data.rank?.toFixed(2)}</span>
        </div>
        <div className="pokemon-distribution-tooltip-row">
          <label className="pokemon-distribution-tooltip-label">
            {t("count")}:
          </label>
          <span>{data.count}</span>
        </div>
      </div>
    )
  }
  return null
}

interface PokemonScatterPointProps {
  cx?: number
  cy?: number
  fill?: string
  payload?: any
}

function PokemonScatterPoint({
  cx = 0,
  cy = 0,
  payload
}: PokemonScatterPointProps) {
  const size = 28
  return (
    <g>
      <defs>
        <clipPath id={`clip-circle-${payload?.name || "default"}`}>
          <circle cx={cx} cy={cy} r={size / 2} />
        </clipPath>
      </defs>
      <image
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        xlinkHref={getPokemonPortraitPath(payload?.name || "")}
        clipPath={`url(#clip-circle-${payload?.name || "default"})`}
      />
    </g>
  )
}

interface PokemonDistributionProps {
  metaPokemons: IPokemonsStatisticV2[]
  eloThreshold: EloRank
  loading: boolean
  synergy?: Synergy | "all"
  rarity?: Rarity | "all"
  pool?: string
  tier?: string
  selectedPkm?: Pkm | ""
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
  const types = PRECOMPUTED_POKEMONS_PER_TYPE[synergy]
  return types.includes(pokemonName)
}

function hasRarity(pokemonName: Pkm, rarity: Rarity | "all"): boolean {
  if (rarity === "all") return true
  return PRECOMPUTED_POKEMONS_PER_RARITY[rarity].includes(pokemonName)
}

function isCorrectTier(pokemonName: Pkm, tier: string): boolean {
  if (tier === "all") return true
  const data = getPokemonData(pokemonName)
  return data.stars?.toString() === tier
}

export function PokemonDistribution({
  metaPokemons,
  eloThreshold,
  loading,
  synergy = "all",
  rarity = "all",
  pool = "all",
  tier = "all",
  selectedPkm = ""
}: PokemonDistributionProps) {
  const scatterData = useMemo(() => {
    const tierData = metaPokemons.find((i) => i.tier === eloThreshold)
    if (!tierData) return []

    // Map every pokemon to scatter plot coordinates
    const pokemons = Object.values(tierData.pokemons)
      .map((pokemon) => ({
        rank: pokemon.rank,
        count: pokemon.count,
        name: pokemon.name
      }))
      .filter((pokemon) => {
        // Apply filters
        if (pokemon.count === 0) return false
        if (selectedPkm !== "" && pokemon.name !== selectedPkm) {
          return false
        }
        if (!hasType(pokemon.name as Pkm, synergy)) return false
        if (!hasRarity(pokemon.name as Pkm, rarity)) return false
        if (!isInPool(pokemon.name as Pkm, pool)) return false
        if (!isCorrectTier(pokemon.name as Pkm, tier)) return false
        return true
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 400)

    return pokemons
  }, [metaPokemons, eloThreshold, synergy, rarity, pool, tier, selectedPkm])

  const xAxisDomain = useMemo(() => {
    if (scatterData.length === 0) return [0, 8]
    const ranks = scatterData.map((pokemon) => pokemon.rank)
    const min = Math.min(...ranks)
    const max = Math.max(...ranks)
    return [Math.max(0, min - 0.1), max + 0.1]
  }, [scatterData])

  return (
    <div id="pokemon-distribution">
      {scatterData.length === 0 ? (
        <p>{loading ? t("loading") : t("no_data_available")}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            data={scatterData}
            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="rank"
              domain={xAxisDomain}
              tickFormatter={(value) => value.toFixed(2)}
              tick={{ fill: "#ddd", fontSize: 10 }}
              label={{
                value: "Average Rank",
                position: "insideBottomRight",
                offset: -5,
                fill: "#ddd",
                fontSize: 11
              }}
            />
            <YAxis
              dataKey="count"
              tick={{ fill: "#ddd", fontSize: 10 }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                fill: "#ddd",
                fontSize: 11
              }}
              width={35}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
              animationDuration={0}
            />
            <Scatter
              name="Pokemons"
              data={scatterData}
              fill="#82ca9d"
              shape={<PokemonScatterPoint />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
