import React from "react"
import { useTranslation } from "react-i18next"
import { IMeta } from "../../../../../models/mongo-models/meta"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../../../utils/avatar"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"

export function rankType(
  a: Synergy,
  b: Synergy,
  types: { [key in Synergy]?: number }
) {
  const sa = types[a]
  const sb = types[b]
  const va = sa ? sa : 0
  const vb = sb ? sb : 0
  return vb - va
}

function rankPokemon(a: Pkm, b: Pkm, pokemons: { [key in Pkm]?: number }) {
  const pa = pokemons[a]
  const pb = pokemons[b]
  const va = pa ? pa : 0
  const vb = pb ? pb : 0
  return vb - va
}

export default function TeamComp(props: { team: IMeta; rank: number }) {
  const { t } = useTranslation()
  const sortedTypes = props.team.types
    ? (Object.keys(props.team.types) as Synergy[]).sort((a, b) => {
      return rankType(a, b, props.team.types)
    })
    : new Array<Synergy>()
  const sortedPokemons = props.team.pokemons
    ? (Object.keys(props.team.pokemons) as Pkm[]).sort((a, b) => {
      return rankPokemon(a, b, props.team.pokemons)
    })
    : new Array<Pkm>()

  return (
    <div className="team-comp my-box" id={props.team.cluster_id}>
      <span className="rank">{props.rank}</span>
      <div style={{ display: "flex", width: "fit-content" }}>
        {sortedTypes.slice(0, 3).map((type) => (
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center"
            }}
            key={type}
          >
            <SynergyIcon type={type.toUpperCase() as Synergy} size="48px" />
            <span>{props.team.types[type]}</span>
          </div>
        ))}
      </div>
      <span>
        <label>{t("average_place")}:</label>
        {props.team.mean_rank.toFixed(2)}
      </span>
      <span>
        <label>{t("winrate")}:</label>
        {props.team.winrate.toFixed(2)} %
      </span>
      <span>
        <label>{t("popularity")}:</label>
        {props.team.ratio.toFixed(2)} %
      </span>
      <span>
        <label>{t("count")}:</label>
        {props.team.count}
      </span>
      <div style={{ display: "flex", gap: "1em" }}>
        {sortedPokemons.map((pokemon) => {
          return (
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center"
              }}
              key={pokemon}
            >
              <PokemonPortrait portrait={PkmIndex[pokemon]} />
              <span>
                {((props.team.pokemons[pokemon] ?? 0) * 100).toFixed(0) + "%"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
