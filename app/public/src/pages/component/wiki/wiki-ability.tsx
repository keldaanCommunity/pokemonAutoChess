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
import { Tooltip } from "react-tooltip"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { useTranslation } from "react-i18next"

const precomputed = PRECOMPUTED_ABILITY as PrecomputedAbility

export default function WikiAbility() {
  const { t } = useTranslation()
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
      {hoveredPokemon && (
        <Tooltip
          id="pokemon-detail"
          className="customeTheme game-pokemon-detail-tooltip"
          float
        >
          <GamePokemonDetail pokemon={hoveredPokemon} />
        </Tooltip>
      )}
    </div>
  )
}
