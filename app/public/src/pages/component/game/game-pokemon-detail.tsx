import React, { useMemo } from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Passive } from "../../../../../types/enum/Passive"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { AbilityTooltip } from "../ability/ability-tooltip"
import SynergyIcon from "../icons/synergy-icon"
import "./game-pokemon-detail.css"
import { useTranslation } from "react-i18next"
import { Emotion } from "../../../../../types"

export function GamePokemonDetail(props: {
  pokemon: Pokemon
  shiny?: boolean
  emotion?: Emotion
}) {
  const { t } = useTranslation()
  const pokemonStats = useMemo(
    () => [
      { stat: Stat.HP, value: props.pokemon.hp },
      { stat: Stat.DEF, value: props.pokemon.def },
      { stat: Stat.ATK, value: props.pokemon.atk },
      { stat: Stat.PP, value: props.pokemon.maxPP },
      { stat: Stat.SPE_DEF, value: props.pokemon.speDef },
      { stat: Stat.RANGE, value: props.pokemon.range }
    ],
    [
      props.pokemon.atk,
      props.pokemon.def,
      props.pokemon.hp,
      props.pokemon.maxPP,
      props.pokemon.range,
      props.pokemon.speDef
    ]
  )

  return (
    <div className="game-pokemon-detail in-shop">
      <img
        className="game-pokemon-detail-portrait"
        style={{ borderColor: RarityColor[props.pokemon.rarity] }}
        src={getPortraitSrc(
          props.pokemon.index,
          props.shiny ?? props.pokemon.shiny,
          props.emotion ?? props.pokemon.emotion
        )}
      />
      <div className="game-pokemon-detail-entry">
        <p className="game-pokemon-detail-entry-name">
          {t(`pkm.${props.pokemon.name}`)}
        </p>
        <p
          className="game-pokemon-detail-entry-rarity"
          style={{ color: RarityColor[props.pokemon.rarity] }}
        >
          {t(`rarity.${props.pokemon.rarity}`)}
        </p>
        <p className="game-pokemon-detail-entry-tier">
          {Array.from({ length: props.pokemon.stars }, (_, index) => (
            <img key={index} src="assets/ui/star.svg" height="16"></img>
          ))}
        </p>
      </div>

      <div className="game-pokemon-detail-types">
        {props.pokemon.types.map((type) => (
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

      {props.pokemon.passive !== Passive.NONE && (
        <div className="game-pokemon-detail-passive">
          <p>
            {t("passive")}:&nbsp;
            {addIconsToDescription(
              t(`passive_description.${props.pokemon.passive}`)
            )}
          </p>
        </div>
      )}

      {props.pokemon.skill !== Ability.DEFAULT && (
        <div className="game-pokemon-detail-ult">
          <div className="ability-name">
            <p>{t(`ability.${props.pokemon.skill}`)}</p>
          </div>
          <div>
            <AbilityTooltip
              ability={props.pokemon.skill}
              tier={props.pokemon.stars}
            />
          </div>
        </div>
      )}
    </div>
  )
}
