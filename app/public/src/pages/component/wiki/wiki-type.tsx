import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import PokemonFactory, {
  isAdditionalPick
} from "../../../../../models/pokemon-factory"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed"
import { RarityColor, SynergyTriggers } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { Synergy, SynergyEffects } from "../../../../../types/enum/Synergy"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { EffectDescriptionComponent } from "../synergy/effect-description"

export default function WikiType(props: { type: Synergy | "all" }) {
  const { t } = useTranslation()

  let pokemonsNames: Pkm[]
  if (props.type === "all") {
    pokemonsNames = Object.values(Pkm).filter((p) => p !== Pkm.DEFAULT)
  } else {
    pokemonsNames = PRECOMPUTED_POKEMONS_PER_TYPE[props.type].filter(
      (p) => p !== Pkm.DEFAULT
    ) as Pkm[]
  }

  const pokemons = pokemonsNames
    .map((p) => PokemonFactory.createPokemonFromName(p))
    .sort((a, b) => a.stars - b.stars) // put first stage first
    .filter((a, index, list) => {
      if (a.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      if (a.rarity === Rarity.SPECIAL) return true // show all summons & specials, even in the same family

      // remove if already one member of family in the list
      return (
        list.findIndex((b) => PkmFamily[a.name] === PkmFamily[b.name]) === index
      )
    })

  const pokemonsPerRarity = groupBy(pokemons, (p) => p.rarity)
  for (const rarity in pokemonsPerRarity) {
    pokemonsPerRarity[rarity].sort((a: Pokemon, b: Pokemon) => {
      const isAddA = isAdditionalPick(a.name),
        isAddB = isAdditionalPick(b.name)
      if (isAddA !== isAddB) return +isAddA - +isAddB
      return a.index < b.index ? -1 : 1
    })
  }

  return (
    <div style={{ padding: "1em" }}>
      {props.type !== "all" && (
        <>
          <h2>
            <SynergyIcon type={props.type} /> {t(`synergy.${props.type}`)}
          </h2>
          <p>{addIconsToDescription(t(`synergy_description.${props.type}`))}</p>
          {SynergyEffects[props.type].map((effect, i) => {
            return (
              <div
                key={t(`effect.${effect}`)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span>
                  ({SynergyTriggers[props.type][i]}) {t(`effect.${effect}`)}
                  :&nbsp;
                </span>
                <EffectDescriptionComponent effect={effect} />
              </div>
            )
          })}
        </>
      )}
      <table>
        <tbody>
          {(Object.values(Rarity) as Rarity[]).map((rarity) => {
            return (
              <tr key={rarity}>
                <td style={{ color: RarityColor[rarity] }}>
                  {t(`rarity.${rarity}`)}
                </td>
                <td>
                  {(pokemonsPerRarity[rarity] ?? []).map((p) => {
                    return (
                      <div
                        key={p.name}
                        className={cc("pokemon-portrait", {
                          additional: isAdditionalPick(p.name)
                        })}
                      >
                        <img
                          src={getPortraitSrc(p.index)}
                          data-tooltip-id={`pokemon-detail-${p.index}`}
                        />
                        <Tooltip
                          id={`pokemon-detail-${p.index}`}
                          className="custom-theme-tooltip game-pokemon-detail-tooltip"
                        >
                          <GamePokemonDetail pokemon={p} />
                        </Tooltip>
                      </div>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
