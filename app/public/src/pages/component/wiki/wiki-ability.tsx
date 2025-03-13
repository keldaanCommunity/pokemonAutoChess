import React, { useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_ABILITY } from "../../../../../models/precomputed/precomputed-ability"
import { Ability } from "../../../../../types/enum/Ability"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { usePreference } from "../../../preferences"
import { AbilityPerTM, Item, TMs } from "../../../../../types/enum/Item"
import { ItemDetailTooltip } from "../../../game/components/item-detail"

export default function WikiAbility() {
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()
  const [itemHovered, setItemHovered] = useState<Item>()

  const [searchQuery, setSearchQuery] = useState<string>("")
  const pokemonsPerAbility = useMemo(() => Object.keys(Ability).reduce((o, ability) => {
    o[ability] = PRECOMPUTED_POKEMONS_PER_ABILITY[ability].map((p) => getPokemonData(p)).sort((a, b) => {
      if (a.additional !== b.additional) return +a.additional - +b.additional
      // sort by PkmFamily
      const familyA = PkmFamily[a.name], familyB = PkmFamily[b.name]
      if (familyA !== familyB) return PkmIndex[familyA].localeCompare(PkmIndex[familyB])
      return 0
    }).sort((a, b) => {
      // then by stars
      const familyA = PkmFamily[a.name], familyB = PkmFamily[b.name]
      if (familyA === familyB && a.stars !== b.stars) return a.stars - b.stars
      return 0
    })
    return o
  }, {}), [])


  const tmPerAbility = useMemo<Partial<Record<Ability, Item>>>(() => Object.fromEntries(Object.entries(AbilityPerTM).map(([tm, ability]) => [ability, tm])), [])

  const filteredAbilities = (Object.keys(Ability) as Ability[])
    .filter((a) => a !== Ability.DEFAULT && (
      !searchQuery.trim() ||
      `${t(`ability.${a}`)} ${t(`ability_description.${a}`)}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ))
    .sort((a, b) => t(`ability.${a}`).localeCompare(t(`ability.${b}`)))

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
                  {tmPerAbility[ability] && (
                    <li data-tooltip-id="item-detail" onMouseOver={() => setItemHovered(tmPerAbility[ability])} >
                      <img src={`assets/item/${TMs.includes(tmPerAbility[ability]) ? "TM" : "HM"}.png`} className={cc("item", { pixelated: !antialiasing })} />
                    </li>
                  )}
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
      {itemHovered && <Tooltip
        id="item-detail"
        className="custom-theme-tooltip item-detail-tooltip"
      >
        <ItemDetailTooltip item={itemHovered} />
      </Tooltip>}
    </div>
  )
}
