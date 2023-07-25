import React, { useState } from "react"
import { Ability } from "../../../../../types/enum/Ability"
import { addIconsToDescription } from "../../utils/descriptions"
import PokemonFactory, {
  isAdditionalPick
} from "../../../../../models/pokemon-factory"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import { PrecomputedAbility } from "../../../../../types"
import PRECOMPUTED_ABILITY from "../../../../../models/precomputed/ability.json"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import ReactTooltip from "react-tooltip"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { t } from "i18next"

const precomputed = PRECOMPUTED_ABILITY as PrecomputedAbility

export default function WikiAbility() {
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon>()

  return (
    <div id="wiki-ability">
      <ul>
        {(Object.keys(Ability) as Ability[])
          .filter((a) => a !== Ability.DEFAULT)
          .sort()
          .map((ability) => {
            return (
              <li key={ability} className="nes-container">
                <div>
                  <h4>{t(`ability.${ability}`)}</h4>
                  <p>
                    {addIconsToDescription(t(`ability_description.${ability}`))}
                  </p>
                </div>
                <div>
                  <ul>
                    {precomputed[ability]
                      .map((p) => PokemonFactory.createPokemonFromName(p))
                      .map((p) => (
                        <li key={p.name}>
                          <div
                            className={cc("pokemon-portrait", {
                              additional: isAdditionalPick(p.name)
                            })}
                            data-tip
                            data-for="pokemon-detail"
                            onMouseOver={() => {
                              setHoveredPokemon(p)
                            }}
                          >
                            <img
                              src={getPortraitSrc(p.index)}
                              alt={p.name}
                              title={p.name}
                            />
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </li>
            )
          })}
      </ul>
      {hoveredPokemon && (
        <ReactTooltip
          id="pokemon-detail"
          className="customeTheme game-pokemon-detail-tooltip"
          effect="float"
        >
          <GamePokemonDetail pokemon={hoveredPokemon} />
        </ReactTooltip>
      )}
    </div>
  )
}
