import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Emotion } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { AbilityTooltip } from "../ability/ability-tooltip"
import SynergyIcon from "../icons/synergy-icon"
import "./game-pokemon-detail.css"

export function GamePokemonDetail(props: {
  pokemon: Pkm | Pokemon
  shiny?: boolean
  emotion?: Emotion
}) {
  const { t } = useTranslation()
  const pokemon: Pokemon = useMemo(
    () =>
      typeof props.pokemon === "string"
        ? PokemonFactory.createPokemonFromName(props.pokemon)
        : props.pokemon,
    [props.pokemon]
  )

  const pokemonStats = useMemo(
    () => [
      { stat: Stat.HP, value: pokemon.hp },
      { stat: Stat.DEF, value: pokemon.def },
      { stat: Stat.ATK, value: pokemon.atk },
      { stat: Stat.PP, value: pokemon.maxPP },
      { stat: Stat.SPE_DEF, value: pokemon.speDef },
      { stat: Stat.RANGE, value: pokemon.range }
    ],
    [
      pokemon.atk,
      pokemon.def,
      pokemon.hp,
      pokemon.maxPP,
      pokemon.range,
      pokemon.speDef
    ]
  )

  return (
    <div className="game-pokemon-detail in-shop">
      <img
        className="game-pokemon-detail-portrait"
        style={{ borderColor: RarityColor[pokemon.rarity] }}
        src={getPortraitSrc(
          pokemon.index,
          props.shiny ?? pokemon.shiny,
          props.emotion ?? pokemon.emotion
        )}
      />
      <div className="game-pokemon-detail-entry">
        <p className="game-pokemon-detail-entry-name">
          {t(`pkm.${pokemon.name}`)}
        </p>
        <p
          className="game-pokemon-detail-entry-rarity"
          style={{ color: RarityColor[pokemon.rarity] }}
        >
          {t(`rarity.${pokemon.rarity}`)}
        </p>
        <p className="game-pokemon-detail-entry-tier">
          {Array.from({ length: pokemon.stars }, (_, index) => (
            <img key={index} src="assets/ui/star.svg" height="16"></img>
          ))}
        </p>
      </div>

      <div className="game-pokemon-detail-types">
        {Array.from(pokemon.types.values()).map((type) => (
          <SynergyIcon type={type} key={type} />
        ))}
      </div>

      <div className="game-pokemon-detail-stats">
        {pokemonStats.map(({ stat, value }) => (
          <div key={stat}>
            <img
              src={`assets/icons/${stat}.png`}
              alt={stat}
              title={t(`stat.${stat}`)}
            />
            <p>{value}</p>
          </div>
        ))}
      </div>

      {pokemon.passive !== Passive.NONE && (
        <div className="game-pokemon-detail-passive">
          <p>
            {addIconsToDescription(t(`passive_description.${pokemon.passive}`))}
          </p>
        </div>
      )}

      {pokemon.skill !== Ability.DEFAULT && (
        <div className="game-pokemon-detail-ult">
          <div className="ability-name">
            <p>{t(`ability.${pokemon.skill}`)}</p>
          </div>
          <div>
            <AbilityTooltip
              ability={pokemon.skill}
              tier={pokemon.stars}
              key={pokemon.id}
            />
          </div>
        </div>
      )}
    </div>
  )
}
