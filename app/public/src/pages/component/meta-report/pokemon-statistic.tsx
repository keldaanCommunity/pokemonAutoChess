import React from "react"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import { useTranslation } from "react-i18next"
import { getPortraitSrc } from "../../../utils"
import STARS from "../../../../../models/precomputed/stars.json"
import { Synergy } from "../../../../../types/enum/Synergy"
import PRECOMPUTED_TYPE_ALL from "../../../../../models/precomputed/type-pokemons-all.json"
import PRECOMPUTED_RARITY_ALL from "../../../../../models/precomputed/type-rarity-all.json"
import { Rarity } from "../../../../../types/enum/Game"

export default function PokemonStatistic(props: {
  pokemons: IPokemonsStatistic[]
  rankingBy: string
  synergy: Synergy | "all"
  rarity: Rarity | "all"
}) {
  const { t } = useTranslation()

  type FamilyStats = {
    pokemons: IPokemonsStatistic[]
    totalCount?: number
    averageRank?: number | null
  }
  const families = new Map<Pkm, FamilyStats>()

  const filteredPokemons = props.pokemons
    .filter((v) =>
      props.synergy === "all"
        ? v
        : PRECOMPUTED_TYPE_ALL[props.synergy].includes(v.name)
    )
    .filter((v) =>
      props.rarity === "all"
        ? v
        : PRECOMPUTED_RARITY_ALL[props.rarity].includes(v.name)
    )
  filteredPokemons.forEach((pokemon) => {
    const family = families.get(PkmFamily[pokemon.name])
    if (family) {
      family.pokemons.push(pokemon)
    } else {
      families.set(PkmFamily[pokemon.name], { pokemons: [pokemon] })
    }
  })
  families.forEach((family) => {
    family.pokemons.sort((a, b) => STARS[a.name] - STARS[b.name])
    family.totalCount = family.pokemons.reduce(
      (prev, curr) => prev + curr.count,
      0
    )
    family.averageRank = computeAverageRank(family.pokemons)
  })

  const familiesArray = Array.from(families).sort((a, b) =>
    props.rankingBy === "count"
      ? b[1].totalCount! - a[1].totalCount!
      : (a[1].averageRank ?? 9) - (b[1].averageRank ?? 9)
  )

  if (filteredPokemons.length === 0) {
    return <p>{t("no_data_available")}</p>
  }
  return (
    <div style={{ height: "calc(90vh - 8em)", overflowY: "scroll" }}>
      {familiesArray.map(([pkm, family], i) => (
        <div key={pkm} className="nes-container pokemon-family-stat">
          <span className="rank">{i + 1}</span>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {family.pokemons.map((pokemon, i) => (
              <li key={pokemon.name}>
                <img
                  className="pokemon-portrait"
                  src={getPortraitSrc(PkmIndex[pokemon.name])}
                />
                <span>{t(`pkm.${pokemon.name}`)}</span>
              </li>
            ))}
          </ul>

          <span style={{ fontSize: "150%" }}>
            {t("average_place")}{" "}
            {family.averageRank ? family.averageRank.toFixed(1) : "???"}
          </span>

          <span style={{ fontSize: "150%" }}>
            <label>{t("count")}:</label> {family.totalCount}
          </span>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {family.pokemons.map((pokemon) => (
              <li
                key={pokemon.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 6ch 12ch 1fr"
                }}
              >
                <img
                  className="pokemon-portrait"
                  src={getPortraitSrc(PkmIndex[pokemon.name])}
                />
                <span>
                  {pokemon.count === 0 ? "???" : pokemon.rank.toFixed(1)}
                </span>
                <span>
                  <label>{t("count")}:</label> {pokemon.count}
                </span>
                <div>
                  <label>{t("popular_items")}:</label>
                  {pokemon.items.map((item) => (
                    <img
                      key={item}
                      src={"assets/item/" + item + ".png"}
                      style={{
                        height: "32px",
                        width: "32px",
                        marginLeft: "4px"
                      }}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function computeAverageRank(pokemons: IPokemonsStatistic[]): number | null {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return null
  return (
    pokemonsPlayedAtLeastOnce.reduce(
      (prev, curr) => prev + curr.rank * curr.count,
      0
    ) / pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.count, 0)
  )
}
