import React from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { AttackTypeColor, RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { AbilityName } from "../../../../../types/strings/Ability"
import { AttackTypeLabel } from "../../../../../types/strings/AttackType"
import { StatLabel } from "../../../../../types/strings/Stat"
import { getPortraitSrc } from "../../../utils"
import { AbilityTooltip } from "../ability/ability-tooltip"
import SynergyIcon from "../icons/synergy-icon"
import "./game-pokemon-detail.css"

export function GamePokemonDetail(props: { 
  pokemon: Pokemon,
  pokemonConfig: IPokemonConfig | undefined
}) {
  const pokemonStats = [
    { stat: Stat.HP, value: props.pokemon.hp },
    { stat: Stat.DEF, value: props.pokemon.def },
    { stat: Stat.ATK, value: props.pokemon.atk },
    { stat: Stat.MANA, value: props.pokemon.maxMana },
    { stat: Stat.SPE_DEF, value: props.pokemon.speDef },
    { stat: Stat.RANGE, value: props.pokemon.range }
  ]

  return (
    <div className="game-pokemon-detail in-shop">
      <img
        className="game-pokemon-detail-portrait"
        style={{ borderColor: RarityColor[props.pokemon.rarity] }}
        src={getPortraitSrc(
          props.pokemon.index,
          props.pokemonConfig?.selectedShiny ?? props.pokemon.shiny,
          props.pokemonConfig?.selectedEmotion ?? props.pokemon.emotion
        )}
      />
      <div className="game-pokemon-detail-entry">
        <p className="game-pokemon-detail-entry-name">{props.pokemon.name}</p>
        <p
          className="game-pokemon-detail-entry-rarity"
          style={{ color: RarityColor[props.pokemon.rarity] }}
        >
          {props.pokemon.rarity}
        </p>
        <p
          className="game-pokemon-detail-entry-attack-type"
          style={{ color: AttackTypeColor[props.pokemon.attackType] }}
        >
          {AttackTypeLabel[props.pokemon.attackType].eng}
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
              title={StatLabel[stat]["eng"]}
            />
            <p>{value}</p>
          </div>
        ))}
      </div>

      {props.pokemon.skill !== Ability.DEFAULT && (
        <div className="game-pokemon-detail-ult">
          <div>
            <p>{AbilityName[props.pokemon.skill].eng}</p>
          </div>
          <div>
            <AbilityTooltip ability={props.pokemon.skill} />
          </div>
        </div>
      )}
    </div>
  )
}
