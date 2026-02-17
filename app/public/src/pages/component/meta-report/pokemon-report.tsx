import { t } from "i18next"
import React, { useEffect, useMemo, useState } from "react"
import { EloRankThreshold, RarityColor } from "../../../../../config"
import {
  fetchMetaPokemons,
  IPokemonStatV2,
  IPokemonsStatisticV2
} from "../../../../../models/mongo-models/pokemons-statistic-v2"
import { EloRank } from "../../../../../types/enum/EloRank"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import { PokemonDistribution } from "./pokemon-distribution"
import { PokemonHistoryPanel } from "./pokemon-history-panel"
import PokemonStatistic from "./pokemon-statistic"
import "./pokemon-report.css"

type ViewMode = "distribution" | "count-history" | "rank-history"

export function PokemonReport() {
  const [pokemonRankingBy, setPokemonRanking] = useState<string>("count")
  const [synergy, setSynergy] = useState<Synergy | "all">("all")
  const [rarity, setRarity] = useState<Rarity | "all">("all")
  const [pool, setPool] = useState<string>("all")
  const [tier, setTier] = useState<string>("all")
  const [loading, setLoading] = useState<boolean>(true)
  const [eloThreshold, setEloTreshold] = useState<EloRank>(EloRank.LEVEL_BALL)
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")
  const [viewMode, setViewMode] = useState<ViewMode>("distribution")

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
        <div className="filters">
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
              <option
                value={r}
                key={r}
                style={{ color: RarityColor[r as Rarity] }}
              >
                {t(`rarity.${r}`)}
              </option>
            ))}
          </select>
          <select value={pool} onChange={(e) => setPool(e.target.value)}>
            <option value={"all"}>
              {t("pool_label")}: {t("all")}
            </option>
            {["regular", "additional", "regional"].map((p) => (
              <option value={p} key={p}>
                {t(`pool.${p}`)}
              </option>
            ))}
            <option value={"special"} key={"special"}>
              {t(`rarity.SPECIAL`)}
            </option>
          </select>
          <select value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value={"all"}>
              {t("tier")}: {t("all")}
            </option>
            {[1, 2, 3, 4].map((p) => (
              <option value={p} key={p}>
                {`⭐`.repeat(p)}
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
        </div>
        <PokemonTypeahead
          value={selectedPkm ?? ""}
          onChange={(pkm) => setSelectedPkm(pkm)}
        />
      </header>
      {loading && <p>{t("loading")}</p>}
      {!loading && (
        <div className="pokemon-report-content">
          <div className="pokemon-statistics-list">
            <PokemonStatistic
              pokemons={
                sortedMetaPokemons?.find((p) => p.tier === eloThreshold)
                  ?.pokemons || new Array<IPokemonStatV2>()
              }
              rankingBy={pokemonRankingBy}
              synergy={synergy}
              rarity={rarity}
              pool={pool}
              tier={tier}
              selectedPkm={selectedPkm}
            />
          </div>
          <div className="pokemon-distribution-chart">
            <div className="view-switcher">
              <button
                className={viewMode === "distribution" ? "active" : ""}
                onClick={() => setViewMode("distribution")}
              >
                {t("overview")}
                <span className="view-limit-hint">
                  {t("top_n", { count: 400 })}
                </span>
              </button>
              <button
                className={viewMode === "count-history" ? "active" : ""}
                onClick={() => setViewMode("count-history")}
              >
                {t("popularity_over_time")}
                <span className="view-limit-hint">
                  {t("top_n", { count: 200 })}
                </span>
              </button>
              <button
                className={viewMode === "rank-history" ? "active" : ""}
                onClick={() => setViewMode("rank-history")}
              >
                {t("placement_over_time")}
                <span className="view-limit-hint">
                  {t("top_n", { count: 200 })}
                </span>
              </button>
            </div>
            {viewMode === "distribution" && (
              <PokemonDistribution
                metaPokemons={metaPokemons}
                eloThreshold={eloThreshold}
                loading={loading}
                synergy={synergy}
                rarity={rarity}
                pool={pool}
                tier={tier}
                selectedPkm={selectedPkm}
              />
            )}
            {viewMode === "count-history" && (
              <PokemonHistoryPanel
                metaPokemons={metaPokemons}
                eloThreshold={eloThreshold}
                loading={loading}
                metric="count"
                synergy={synergy}
                rarity={rarity}
                pool={pool}
                tier={tier}
                selectedPkm={selectedPkm}
              />
            )}
            {viewMode === "rank-history" && (
              <PokemonHistoryPanel
                metaPokemons={metaPokemons}
                eloThreshold={eloThreshold}
                loading={loading}
                metric="rank"
                synergy={synergy}
                rarity={rarity}
                pool={pool}
                tier={tier}
                selectedPkm={selectedPkm}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
