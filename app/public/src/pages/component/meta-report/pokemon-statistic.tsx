import React from "react"
import { useTranslation } from "react-i18next"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { List, useDynamicRowHeight } from "react-window"
import {
  IHistoryEntry,
  IPokemonStatV2
} from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import PokemonPortrait from "../pokemon-portrait"
import { HistoryDelta } from "./history-delta"
import {
  type HistorySeries,
  MultiLineHistoryChart
} from "./multi-line-history-chart"
import "./pokemon-statistic.css"

export default function PokemonStatistic(props: {
  pokemons: IPokemonStatV2[]
  rankingBy: string
  synergy: Synergy | "all"
  rarity: Rarity | "all"
  pool: string
  tier: string
  selectedPkm: string
}) {
  const { t } = useTranslation()

  type FamilyStats = {
    pokemons: IPokemonStatV2[]
    totalCount?: number
    averageRank?: number | null
    averageItemHeld?: number | null
  }
  const families = new Map<Pkm, FamilyStats>()

  const filteredPokemons = props.pokemons.filter(
    (p) =>
      hasType(p, props.synergy) &&
      hasRarity(p, props.rarity) &&
      isInPool(p, props.pool) &&
      (props.tier === "all" || getPokemonData(p.name).stars === +props.tier) &&
      (props.selectedPkm === "" || p.name === props.selectedPkm)
  )

  filteredPokemons.forEach((pokemon) => {
    const familyName = PkmFamily[pokemon.name]
    const family = families.get(familyName)
    if (family) {
      family.pokemons.push(pokemon)
    } else {
      families.set(PkmFamily[pokemon.name], { pokemons: [pokemon] })
    }
  })

  families.forEach((family) => {
    family.pokemons.sort(
      (a, b) => getPokemonData(a.name).stars - getPokemonData(b.name).stars
    )
    family.totalCount = family.pokemons.reduce(
      (prev, curr) => prev + curr.count,
      0
    )
    family.averageRank = computeAverageRank(family.pokemons)
    family.averageItemHeld = computeAverageItemHeld(family.pokemons)
  })

  const familiesArray = Array.from(families).sort((a, b) =>
    props.rankingBy === "count"
      ? b[1].totalCount! - a[1].totalCount!
      : props.rankingBy === "item_count"
        ? b[1].averageItemHeld! - a[1].averageItemHeld!
        : (a[1].averageRank ?? 9) - (b[1].averageRank ?? 9)
  )

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: 120,
    key: familiesArray.length
  })

  if (filteredPokemons.length === 0) {
    return <p>{t("no_data_available")}</p>
  }
  return (
    <AutoSizer
      renderProp={({ height, width }) => {
        if (height === undefined || width === undefined) return null
        return (
          <List<PkmnStatRowData>
            style={{ height, width }}
            rowCount={familiesArray.length}
            rowHeight={dynamicRowHeight}
            rowComponent={PokemonFamilyRow}
            rowProps={{
              familiesArray,
              t
            }}
          />
        )
      }}
    />
  )
}

type PkmnStatRowData = {
  familiesArray: [Pkm, any][]
  t: (key: string) => string
}

function PokemonFamilyRow({
  index,
  style,
  familiesArray,
  t
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & PkmnStatRowData): React.ReactElement | null {
  const [pkm, family] = familiesArray[index]

  return (
    <div style={style}>
      <div>
        <PokemonFamilyCard pkm={pkm} family={family} rank={index + 1} t={t} />
      </div>
    </div>
  )
}

function PokemonFamilyCard(props: {
  pkm: Pkm
  family: {
    pokemons: IPokemonStatV2[]
    totalCount?: number
    averageRank?: number | null
    averageItemHeld?: number | null
  }
  rank: number
  t: (key: string) => string
}) {
  const { pkm, family, rank, t } = props
  const [expanded, setExpanded] = React.useState(false)

  // Build per-pokemon history series
  const rankSeries: HistorySeries[] = React.useMemo(
    () =>
      family.pokemons.map((p) => ({
        name: p.name,
        entries: p.rank_history ?? []
      })),
    [family.pokemons]
  )
  const countSeries: HistorySeries[] = React.useMemo(
    () =>
      family.pokemons.map((p) => ({
        name: p.name,
        entries: p.count_history ?? []
      })),
    [family.pokemons]
  )

  // Aggregated history for delta badges
  const familyRankHistory = aggregateHistory(
    rankSeries.map((s) => s.entries),
    "average"
  )
  const familyCountHistory = aggregateHistory(
    countSeries.map((s) => s.entries),
    "sum"
  )

  return (
    <div className="my-box pokemon-family-stat">
      <div className="pokemon-rank-col">
        <span className="rank">{rank}</span>
        <button
          className="history-expand-btn"
          onClick={() => setExpanded((v) => !v)}
          title={t("history")}
        >
          {expanded ? "▾" : "▸"}
        </button>
      </div>

      <div className="pokemon-family-content">
        <div className="pokemon-family-top">
          <div className="pokemon-family-summary">
            <div className="pokemon-portraits-vertical">
              {family.pokemons.map((pokemon) => (
                <div
                  className="pokemon-detail-row"
                  key={pokemon.name + "-portrait"}
                >
                  <PokemonPortrait
                    portrait={PkmIndex[pokemon.name]}
                    width={40}
                  />
                  <span className="pokemon-name-container">
                    <span>{t(`pkm.${pokemon.name}`)}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="pokemon-family-stats">
              <span className="pokemon-stat-item">
                <div>{t("average_place")}</div>
                <span className="pokemon-stat-value">
                  {family.averageRank ? family.averageRank.toFixed(1) : "???"}
                </span>
                <HistoryDelta entries={familyRankHistory} invertY={true} />
              </span>
              <span className="pokemon-stat-item">
                <div>{t("count")}</div>
                <span className="pokemon-stat-value">{family.totalCount}</span>
                <HistoryDelta entries={familyCountHistory} />
              </span>
              <span className="pokemon-stat-item">
                <div>{t("held_items")}</div>
                <span className="pokemon-stat-value">
                  {family.averageItemHeld?.toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          <div className="pokemon-details-list">
            {family.pokemons.map((pokemon) => (
              <div
                key={pokemon.name + "-details"}
                className="pokemon-detail-row"
              >
                <PokemonPortrait portrait={PkmIndex[pokemon.name]} width={40} />
                <span className="pokemon-detail-stat" title="Average Rank">
                  <strong>
                    {pokemon.count === 0 ? "???" : pokemon.rank.toFixed(1)}
                  </strong>
                </span>
                <span className="pokemon-stat-container">
                  <label>{t("count")}:</label> {pokemon.count}
                </span>
                <span className="pokemon-stat-container">
                  <label>{t("held_items")}:</label> {pokemon.item_count}
                </span>
                <div className="pokemon-items-row">
                  {pokemon.items.map((item) => (
                    <img
                      key={pokemon.name + "-item-" + item}
                      src={"assets/item/" + item + ".png"}
                      className="pokemon-item-img"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {expanded && (
          <div className="pokemon-history-charts">
            <MultiLineHistoryChart
              series={rankSeries}
              label="average_place"
              invertY={true}
            />
            <MultiLineHistoryChart series={countSeries} label="count" />
          </div>
        )}
      </div>
    </div>
  )
}

function computeAverageRank(pokemons: IPokemonStatV2[]): number | null {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return null
  return (
    pokemonsPlayedAtLeastOnce.reduce(
      (prev, curr) => prev + curr.rank * curr.count,
      0
    ) / pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.count, 0)
  )
}

function computeAverageItemHeld(pokemons: IPokemonStatV2[]): number | null {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return null
  return (
    pokemonsPlayedAtLeastOnce.reduce(
      (prev, curr) => prev + curr.item_count * curr.count,
      0
    ) / pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.count, 0)
  )
}

function isInPool(pokemon: IPokemonStatV2, pool: string): boolean {
  if (pool === "all") return true
  const data = getPokemonData(pokemon.name)
  if (pool === "special") return data.rarity === Rarity.SPECIAL
  if (pool === "additional") return data.additional
  if (pool === "regional") return data.regional
  if (pool === "regular")
    return !data.additional && !data.regional && data.rarity !== Rarity.SPECIAL
  return false
}

function hasType(pokemon: IPokemonStatV2, synergy: Synergy | "all"): boolean {
  if (synergy === "all") return true
  const types = PRECOMPUTED_POKEMONS_PER_TYPE[synergy]
  return types.includes(pokemon.name)
}

function hasRarity(pokemon: IPokemonStatV2, rarity: Rarity | "all"): boolean {
  if (rarity === "all") return true
  return PRECOMPUTED_POKEMONS_PER_RARITY[rarity].includes(pokemon.name)
}

function aggregateHistory(
  histories: IHistoryEntry[][],
  mode: "sum" | "average"
): IHistoryEntry[] {
  const nonEmpty = histories.filter((h) => h.length > 0)
  if (nonEmpty.length === 0) return []

  const byDate = new Map<string, number[]>()
  for (const history of nonEmpty) {
    for (const entry of history) {
      const values = byDate.get(entry.date)
      if (values) {
        values.push(entry.value)
      } else {
        byDate.set(entry.date, [entry.value])
      }
    }
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date,
      value:
        mode === "sum"
          ? values.reduce((a, b) => a + b, 0)
          : values.reduce((a, b) => a + b, 0) / values.length
    }))
}
