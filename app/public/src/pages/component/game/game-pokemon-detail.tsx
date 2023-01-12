import React from "react"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { AttackTypeColor, RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { AbilityName, AbilityDescription } from "../../../../../types/strings/Ability"
import { AttackTypeLabel } from "../../../../../types/strings/AttackType"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import "./game-pokemon-detail.css"

export function GamePokemonDetail(props: { pokemon: Pokemon }) {
  return (
    <div className="game-pokemon-detail in-shop">
      <img
          className="game-pokemon-detail-portrait"
          style={{ borderColor: RarityColor[props.pokemon.rarity] }}
          src={getPortraitSrc(
            props.pokemon.index,
            props.pokemon.shiny,
            props.pokemon.emotion
          )}
      />
      <div className="game-pokemon-detail-entry">
        <p className="game-pokemon-detail-entry-name">{props.pokemon.name}</p>
        <p className="game-pokemon-detail-entry-rarity" style={{color: RarityColor[props.pokemon.rarity]}}>{props.pokemon.rarity}</p>
        <p className="game-pokemon-detail-entry-attack-type" style={{color: AttackTypeColor[props.pokemon.attackType]}}>{AttackTypeLabel[props.pokemon.attackType].eng}</p>
      </div>

      <div className="game-pokemon-detail-types">
        {props.pokemon.types.map((type) => (
          <SynergyIcon type={type} key={type} />
        ))}
      </div>
               
      <div className="game-pokemon-detail-stats">
        <div>
          <img src="assets/icons/hp.png" />
          <p>{props.pokemon.hp}</p>
        </div>
        <div>
          <img src="assets/icons/def.png" />
          <p>{props.pokemon.def}</p>
        </div>
        <div>
          <img src="assets/icons/atk.png" />
          <p>{props.pokemon.atk}</p>
        </div>
        <div>
          <img src="assets/icons/mana.png" />
          <p>{props.pokemon.maxMana}</p>
        </div>        
        <div>
          <img src="assets/icons/speDef.png" />
          <p>{props.pokemon.speDef}</p>
        </div>        
        <div>
          <img src="assets/icons/range.png" />
          <p>{props.pokemon.range}</p>
        </div>
      </div>

      {props.pokemon.skill !== Ability.DEFAULT && <div className="game-pokemon-detail-ult">
        <p>{AbilityName[props.pokemon.skill].eng}</p>
        <p>{AbilityDescription[props.pokemon.skill].eng}</p>
      </div>}
    </div>
  )
}
