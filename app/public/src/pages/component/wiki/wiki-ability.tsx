import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"

import { Ability } from "../../../../../types/enum/Ability"
import { addIconsToDescription } from "../../utils/descriptions"
import PokemonFactory, {
  isAdditionalPick
} from "../../../../../models/pokemon-factory"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import { PRECOMPUTED_POKEMONS_PER_ABILITY } from "../../../../../models/precomputed"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { GamePokemonDetail } from "../game/game-pokemon-detail"

export default function WikiAbility() {
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon>()

  return (
    <div id="wiki-ability">
      <ul>
        {(Object.keys(Ability) as Ability[])
          .filter((a) => a !== Ability.DEFAULT)
          .sort((a, b) => t(`ability.${a}`).localeCompare(t(`ability.${b}`)))
          .map((ability) => {
            return (
              <li key={ability} className="nes-container">
                <div>
                  <h2>{t(`ability.${ability}`)}</h2>
                  <p>
                    {addIconsToDescription(t(`ability_description.${ability}`))}
                  </p>
                </div>
                <div>
                  <ul>
                    {PRECOMPUTED_POKEMONS_PER_ABILITY[ability]
                      .map((p) => PokemonFactory.createPokemonFromName(p))
                      .map((p) => (
                        <li key={p.name}>
                          <div
                            className={cc("pokemon-portrait", {
                              additional: isAdditionalPick(p.name)
                            })}
                            data-tooltip-id="pokemon-detail"
                            onMouseOver={() => {
                              setHoveredPokemon(p)
                            }}
                          >
                            <img src={getPortraitSrc(p.index)} />
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            )
          })}
      </ul>
      {hoveredPokemon &&
        ReactDOM.createPortal(
          <Tooltip
            id="pokemon-detail"
            className="custom-theme-tooltip game-pokemon-detail-tooltip"
            float
          >
            <GamePokemonDetail pokemon={hoveredPokemon} />
          </Tooltip>,
          document.body
        )}
    </div>
  )
}
