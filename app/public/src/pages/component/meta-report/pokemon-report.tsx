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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "27px",
          paddingLeft: "15px"
        }}
      >
        <h3>{t("best_pokemons")}</h3>
        <div
          style={{
            display: "flex",
            width: "23%",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "rgb(84, 89, 107)"
          }}
          className="my-select"
        >
          <p style={{ margin: "0px" }}>{t("rank")}</p>
          <select
            value={pokemonRankingBy}
            onChange={(e) => {
              setPokemonRanking(e.target.value)
            }}
            style={{ background: "none", border: "none", color: "white" }}
          >
            <option value="count">{t("by_popularity")}</option>
            <option value="rank">{t("by_average_place")}</option>
          </select>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "rgb(84, 89, 107)"
          }}
          className="my-select"
        >
          <p style={{ margin: "0px" }}>{t("synergies")}</p>
          <select
            value={synergy}
            onChange={(e) => {
              setSynergy(e.target.value as any)
            }}
            style={{
              background: "none",
              border: "none",
              color: "white"
            }}
          >
            <option value={"all"}>All</option>
            {Object.keys(Synergy).map((s) => (
              <option value={s}>{t(`synergy.${s}`)}</option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "rgb(84, 89, 107)"
          }}
          className="my-select"
        >
          <p style={{ margin: "0px" }}>{t("rarity_label")}</p>
          <select
            value={rarity}
            onChange={(e) => {
              setRarity(e.target.value as any)
            }}
            style={{
              background: "none",
              border: "none",
              color: "white"
            }}
          >
            <option value={"all"}>All</option>
            {Object.keys(Rarity).map((s) => (
              <option value={s}>{t(`rarity.${s}`)}</option>
            ))}
          </select>
        </div>
      </div>
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
