import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_ABILITY } from "../../../../../models/precomputed/precomputed-ability"
import { Ability } from "../../../../../types/enum/Ability"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { usePreference } from "../../../preferences"

export default function WikiAbility() {
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [pokemonsPerAbility, setPokemonsPerAbility] = useState<{ [key in Ability]?: IPokemonData[] }>({})
  const filteredAbilities = (Object.keys(Ability) as Ability[])
    .filter((a) => a !== Ability.DEFAULT && (
      !searchQuery.trim() ||
      `${t(`ability.${a}`)} ${t(`ability_description.${a}`)}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ))
    .sort((a, b) => t(`ability.${a}`).localeCompare(t(`ability.${b}`)))


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
      <div className="actions">
        <input type="search" placeholder={t("search")} onInput={event => setSearchQuery((event.target as HTMLInputElement).value)} />
      </div>
      <ul>
        {filteredAbilities.map((ability) => {
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
                        <img src={getPortraitSrc(p.index)} className={cc({ pixelated: !antialiasing })} />
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
