import React from "react"
import { IMeta } from "../../../../../models/mongo-models/meta"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { useTranslation } from "react-i18next"

function capitalizeFirstLetter(string: string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  } else {
    return null
  }
}

function rankType(
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
    <div className="team-comp nes-container">
      <span className="rank">{props.rank}</span>
      <div style={{ display: "flex" }}>
        {sortedTypes.map((type) => (
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
        {capitalizeFirstLetter(sortedTypes[0])}{" "}
        {props.team.types[sortedTypes[0]]} /{" "}
        {capitalizeFirstLetter(sortedTypes[1])}{" "}
        {props.team.types[sortedTypes[1]]}
      </span>
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
              <img
                className="pokemon-portrait"
                src={getPortraitSrc(PkmIndex[pokemon])}
              />
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
