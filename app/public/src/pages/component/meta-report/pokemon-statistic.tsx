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

  const families = new Map<Pkm, IPokemonsStatistic[]>()

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
      family.push(pokemon)
    } else {
      families.set(PkmFamily[pokemon.name], [pokemon])
    }
  })
  families.forEach((family) => {
    family.sort((a, b) => STARS[a.name] - STARS[b.name])
  })

  const familiesArray = Array.from(families).sort((a, b) =>
    props.rankingBy === "count"
      ? b[1].reduce((prev, curr) => prev + curr.count, 0) -
        a[1].reduce((prev, curr) => prev + curr.count, 0)
      : a[1].reduce((prev, curr) => prev + curr.rank, 0) / a[1].length -
        b[1].reduce((prev, curr) => prev + curr.rank, 0) / b[1].length
  )

  if (filteredPokemons.length === 0) {
    return <p>No data available</p>
  }
  return (
    <div style={{ height: "calc(90vh - 8em)", overflowY: "scroll" }}>
      {familiesArray.map(([pkm, pokemons], i) => (
        <div key={pkm} className="nes-container pokemon-family-stat">
          <span className="rank">{i + 1}</span>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {pokemons.map((pokemon, i) => (
              <li>
                <img
                  className="pokemon-portrait"
                  src={getPortraitSrc(PkmIndex[pokemon.name])}
                />
                <span>{t(`pkm.${pokemon.name}`)}</span>
              </li>
            ))}
          </ul>

          <span style={{ fontSize: "150%" }}>
            {t("average_place")} {computeAverageRank(pokemons)}
          </span>

          <span style={{ fontSize: "150%" }}>
            <label>{t("count")}:</label>{" "}
            {pokemons.reduce((prev, curr) => prev + curr.count, 0)}
          </span>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            {pokemons.map((pokemon) => (
              <li
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
                        imageRendering: "pixelated",
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

function computeAverageRank(pokemons: IPokemonsStatistic[]): string {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return "???"
  return (
    pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.rank, 0) /
    pokemonsPlayedAtLeastOnce.length
  ).toFixed(1)
}
