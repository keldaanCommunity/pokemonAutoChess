import React from "react"
import { useTranslation } from "react-i18next"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import {
  PRECOMPUTED_POKEMONS_PER_RARITY,
  PRECOMPUTED_POKEMONS_PER_TYPE,
  getPokemonData
} from "../../../../../models/precomputed"
import { Rarity } from "../../../../../types/enum/Game"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmIndex
} from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../utils"

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
    averageItemHeld?: number | null
  }
  const families = new Map<Pkm, FamilyStats>()
  const duos = Object.values(PkmDuos)

  const filteredPokemons = props.pokemons
    .filter((v) =>
      props.synergy === "all"
        ? v
        : PRECOMPUTED_POKEMONS_PER_TYPE[props.synergy].includes(v.name)
    )
    .filter((v) =>
      props.rarity === "all"
        ? v
        : PRECOMPUTED_POKEMONS_PER_RARITY[props.rarity].includes(v.name)
    )

  filteredPokemons.forEach((pokemon) => {
    let familyName = PkmFamily[pokemon.name]
    const duo = duos.find((duo) => duo.includes(pokemon.name))
    if (duo) {
      familyName = duo[0]
    }

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

  if (filteredPokemons.length === 0) {
    return <p>{t("no_data_available")}</p>
  }
  return (
    <article>
      {familiesArray.map(([pkm, family], i) => (
        <div key={pkm} className="my-box pokemon-family-stat">
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

          <span style={{ fontSize: "150%" }}>
            {family.averageItemHeld?.toFixed(2)}
            <label>{t("held_items")}</label>
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
                  gridTemplateColumns: "40px 6ch 12ch 12ch 256px"
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
                <span>
                  <label>{t("held_items")}:</label> {pokemon.item_count}
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
    </article>
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

function computeAverageItemHeld(pokemons: IPokemonsStatistic[]): number | null {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return null
  return (
    pokemonsPlayedAtLeastOnce.reduce(
      (prev, curr) => prev + curr.item_count * curr.count,
      0
    ) / pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.count, 0)
  )
}
