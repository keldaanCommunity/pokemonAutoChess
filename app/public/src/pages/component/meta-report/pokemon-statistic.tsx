import React from "react"
import { useTranslation } from "react-i18next"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Rarity } from "../../../../../types/enum/Game"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmIndex
} from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../../../utils/avatar"
import PokemonPortrait from "../pokemon-portrait"

export default function PokemonStatistic(props: {
  pokemons: IPokemonsStatistic[]
  rankingBy: string
  synergy: Synergy | "all"
  rarity: Rarity | "all"
  selectedPkm: string
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

  const filteredPokemons = props.pokemons.filter(
    (v) =>
      (props.synergy === "all"
        ? v
        : PRECOMPUTED_POKEMONS_PER_TYPE[props.synergy].includes(v.name)) &&
      (props.rarity === "all"
        ? v
        : PRECOMPUTED_POKEMONS_PER_RARITY[props.rarity].includes(v.name)) &&
      (props.selectedPkm === "" || v.name === props.selectedPkm)
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
                <PokemonPortrait portrait={PkmIndex[pokemon.name]} />
                <span>{t(`pkm.${pokemon.name}`)}</span>
              </li>
            ))}
          </ul>

          <span>
            <label>{t("average_place")}:</label><br />
            <span style={{ fontSize: "140%" }}>{family.averageRank ? family.averageRank.toFixed(1) : "???"}</span>
          </span>

          <span>
            <label>{t("count")}:</label><br />
            <span style={{ fontSize: "140%" }}>{family.totalCount}</span>
          </span>

          <span>
            <label>{t("held_items")}:</label><br />
            <span style={{ fontSize: "140%" }}>{family.averageItemHeld?.toFixed(2)}</span>
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
                  gridTemplateColumns: "40px 6ch 1fr 1.5fr 2fr"
                }}
              >
                <PokemonPortrait portrait={PkmIndex[pokemon.name]} />
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
