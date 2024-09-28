import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_ABILITY } from "../../../../../models/precomputed/precomputed-ability"
import { Ability } from "../../../../../types/enum/Ability"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"

export default function WikiAbility() {
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()

  const [pokemonsPerAbility, setPokemonsPerAbility] = useState<{ [key in Ability]?: IPokemonData[] }>({})
  useEffect(() => {
    const timer = setTimeout(() => {
      setPokemonsPerAbility(Object.keys(Ability).reduce((o, ability) => {
        o[ability] = PRECOMPUTED_POKEMONS_PER_ABILITY[ability].map((p) => getPokemonData(p))
        return o
      }, {}))
    }, 100)
    // Cleanup function to clear the timeout
    return () => clearTimeout(timer);
  }, [])

  return (
    <div id="wiki-ability">
      <ul>
        {(Object.keys(Ability) as Ability[])
          .filter((a) => a !== Ability.DEFAULT)
          .sort((a, b) => t(`ability.${a}`).localeCompare(t(`ability.${b}`)))
          .map((ability) => {
            return (
              <li key={ability} className="my-box">
                <div>
                  <h2>{t(`ability.${ability}`)}</h2>
                  <p>
                    {addIconsToDescription(t(`ability_description.${ability}`))}
                  </p>
                </div>
                <div>
                  <ul>
                    {(pokemonsPerAbility[ability] ?? []).map((p) => (
                      <li key={p.name}>
                        <div
                          className={cc("pokemon-portrait", {
                            additional: p.additional,
                            regional: p.regional
                          })}
                          data-tooltip-id="pokemon-detail"
                          onMouseOver={() => {
                            setHoveredPokemon(p.name)
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
      {hoveredPokemon && <Tooltip
        id="pokemon-detail"
        className="custom-theme-tooltip game-pokemon-detail-tooltip"
        float
      >
        <GamePokemonDetail pokemon={hoveredPokemon} />
      </Tooltip>}
    </div>
  )
}
