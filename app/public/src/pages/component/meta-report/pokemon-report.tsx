import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import {
  IPokemonsStatisticV2,
  fetchMetaPokemons
} from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { EloRankThreshold } from "../../../../../types/Config"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonStatistic from "./pokemon-statistic"
import "./pokemon-report.css"

export function PokemonReport() {
  const [pokemonRankingBy, setPokemonRanking] = useState<string>("count")
  const [synergy, setSynergy] = useState<Synergy | "all">("all")
  const [rarity, setRarity] = useState<Rarity | "all">("all")
  const [loading, setLoading] = useState<boolean>(true)
  const [eloThreshold, setEloTreshold] = useState<EloRank>(EloRank.LEVEL_BALL)
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")

  const [metaPokemons, setMetaPokemons] = useState<IPokemonsStatisticV2[]>([])
  useEffect(() => {
    fetchMetaPokemons().then((res) => {
      setMetaPokemons(res)
      setLoading(false)
    })
  }, [])

  const sortedMetaPokemons = useMemo(() => {
    return [...metaPokemons].map((m) => ({
      tier: m.tier,
      pokemons: (Object.values(m.pokemons) || []).sort((a, b) => {
        const order =
          pokemonRankingBy === "count" || pokemonRankingBy === "item_count"
            ? -1
            : 1
        return (a[pokemonRankingBy] - b[pokemonRankingBy]) * order
      })
    }))
  }, [metaPokemons, pokemonRankingBy])

  return (
    <div id="pokemon-report">
      <header>
        <h2>{t("best_pokemons")}</h2>
        <select
          value={pokemonRankingBy}
          onChange={(e) => setPokemonRanking(e.target.value)}
        >
          <option value="count">
            {t("rank")} {t("by_popularity")}
          </option>
          <option value="rank">
            {t("rank")} {t("by_average_place")}
          </option>
          <option value="item_count">
            {t("rank")} {t("by_average_held_items")}
          </option>
        </select>
        <select
          value={synergy}
          onChange={(e) => {
            setSynergy(e.target.value as Synergy | "all")
          }}
        >
          <option value={"all"}>
            {t("all")} {t("synergies")}
          </option>
          {Object.keys(Synergy).map((s) => (
            <option value={s} key={s}>
              {t(`synergy.${s}`)}
            </option>
          ))}
        </select>
        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value as Rarity | "all")}
        >
          <option value={"all"}>
            {t("rarity_label")}: {t("all")}
          </option>
          {Object.keys(Rarity).map((r) => (
            <option value={r} key={r}>
              {t(`rarity.${r}`)}
            </option>
          ))}
        </select>
        <select
          value={eloThreshold}
          onChange={(e) => setEloTreshold(e.target.value as EloRank)}
        >
          {Object.keys(EloRank).map((r) => (
            <option value={r} key={r}>
              {t(`elorank.${r}`)} ({t("elo")} {">"} {EloRankThreshold[r]})
            </option>
          ))}
        </select>
        <PokemonTypeahead
          value={selectedPkm ?? ""}
          onChange={(pkm) => setSelectedPkm(pkm)}
        />
      </header>
      {loading && <p>{t("loading")}</p>}
      {!loading && (
        <PokemonStatistic
          pokemons={
            sortedMetaPokemons?.find((p) => p.tier === eloThreshold)
              ?.pokemons || new Array<IPokemonsStatistic>()
          }
          rankingBy={pokemonRankingBy}
          synergy={synergy}
          rarity={rarity}
          selectedPkm={selectedPkm}
        />
      )}
    </div>
  )
}
