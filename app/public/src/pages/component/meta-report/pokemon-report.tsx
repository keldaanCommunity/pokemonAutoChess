import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import {
  fetchMetaPokemons,
  IPokemonsStatistic
} from "../../../../../models/mongo-models/pokemons-statistic"
import { Rarity } from "../../../../../types/enum/Game"
import { Synergy } from "../../../../../types/enum/Synergy"
import PokemonStatistic from "./pokemon-statistic"

export function PokemonReport() {
  const [pokemonRankingBy, setPokemonRanking] = useState<string>("count")
  const [synergy, setSynergy] = useState<Synergy | "all">("all")
  const [rarity, setRarity] = useState<Rarity | "all">("all")
  const [loading, setLoading] = useState<boolean>(true)

  const [metaPokemons, setMetaPokemons] = useState<IPokemonsStatistic[]>([])
  useEffect(() => {
    fetchMetaPokemons().then((res) => {
      setMetaPokemons(res)
      setLoading(false)
    })
  }, [])

  const sortedMetaPokemons = useMemo(() => {
    return [...metaPokemons].sort((a, b) => {
      const order = pokemonRankingBy == "count" ? -1 : 1
      return (a[pokemonRankingBy] - b[pokemonRankingBy]) * order
    })
  }, [metaPokemons, pokemonRankingBy])

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
      {loading && <p>{t("loading")}</p>}
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
