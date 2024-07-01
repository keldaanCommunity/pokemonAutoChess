import React, { useCallback, useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_ABILITY } from "../../../../../models/precomputed/precomputed-ability"
import { Ability } from "../../../../../types/enum/Ability"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { debounce } from "../../../../../utils/function"

export default function WikiAbility() {
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()
  const [search, setSearch] = useState<string>()

  const updateSearch = useCallback(
    debounce((e) => setSearch(e.target.value), 300),
    []
  )

  const searchAbilityName = useCallback(
    (ability: Ability) =>
      search &&
      t(`ability.${ability}`).toLowerCase().includes(search.toLowerCase()),
    [search]
  )

  const searchAbilityPokemon = useCallback(
    (ability: Ability) => {
      if (search == null) {
        return true
      }

      const pkmList = PRECOMPUTED_POKEMONS_PER_ABILITY[ability]
      const found = pkmList.find((pkm) =>
        pkm.toLowerCase().includes(search.toLowerCase())
      )
      return found != null
    },
    [search]
  )

  return (
    <div id="wiki-ability">
      <input
        className="pokemon-typeahead"
        placeholder={t("search")}
        onChange={updateSearch}
      />
      <ul>
        {(Object.keys(Ability) as Ability[])
          .filter(
            (a) =>
              a !== Ability.DEFAULT &&
              (searchAbilityName(a) || searchAbilityPokemon(a))
          )
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
                    {PRECOMPUTED_POKEMONS_PER_ABILITY[ability]
                      .map((p) => getPokemonData(p))
                      .map((p) => (
                        <li key={p.name}>
                          <div
                            className={cc("pokemon-portrait", {
                              additional: p.additional,
                              regional: p.regional,
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
