import { t } from "i18next"
import React, { useState } from "react"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import { Rarity } from "../../../../../types/enum/Game"
import { Synergy } from "../../../../../types/enum/Synergy"
import { useAppSelector } from "../../../hooks"
import PokemonStatistic from "./pokemon-statistic"

export function PokemonReport() {
  const [pokemonRankingBy, setPokemonRanking] = useState<string>("count")
  const [synergy, setSynergy] = useState<Synergy | "all">("all")
  const [rarity, setRarity] = useState<Rarity | "all">("all")

  const metaPokemons = useAppSelector((state) => state.lobby.metaPokemons)

  let sortedMetaPokemons = new Array<IPokemonsStatistic>()

  if (pokemonRankingBy == "count") {
    sortedMetaPokemons = [...metaPokemons].sort((a, b) => {
      return b[pokemonRankingBy] - a[pokemonRankingBy]
    })
  } else {
    sortedMetaPokemons = [...metaPokemons].sort((a, b) => {
      return a[pokemonRankingBy] - b[pokemonRankingBy]
    })
  }

  return (
    <div id="pokemon-report">
      <header>
        <h2>{t("best_pokemons")}</h2>
        <select
          value={pokemonRankingBy}
          onChange={(e) => setPokemonRanking(e.target.value)}
          className="my-select"
        >
          <option value="count">
            {t("rank")} {t("by_popularity")}
          </option>
          <option value="rank">
            {t("rank")} {t("by_average_place")}
          </option>
        </select>
        <select
          value={synergy}
          onChange={(e) => {
            setSynergy(e.target.value as any)
          }}
          className="my-select"
        >
          <option value={"all"}>
            {t("ALL")} {t("synergies")}
          </option>
          {Object.keys(Synergy).map((s) => (
            <option value={s} key={s}>
              {t(`synergy.${s}`)}
            </option>
          ))}
        </select>
        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value as any)}
          className="my-select"
        >
          <option value={"all"}>
            {t("rarity_label")}: {t("ALL")}
          </option>
          {Object.keys(Rarity).map((r) => (
            <option value={r} key={r}>
              {t(`rarity.${r}`)}
            </option>
          ))}
        </select>
      </header>
      {
        <PokemonStatistic
          pokemons={sortedMetaPokemons}
          rankingBy={pokemonRankingBy}
          synergy={synergy}
          rarity={rarity}
        />
      }
    </div>
  )
}
