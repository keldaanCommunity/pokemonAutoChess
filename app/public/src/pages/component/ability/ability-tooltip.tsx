import { t } from "i18next"
import { getAbilityConfig } from "../../../../../config/game/abilities"
import type { Ability } from "../../../../../types/enum/Ability"
import { addIconsToDescription } from "../../utils/descriptions"
import "./ability-tooltip.css"

export function AbilityTooltip(props: {
  ability: Ability
  stats?: {
    stars: number
    stages: number
    ap: number
    luck: number
    showAbilityTiers?: boolean
  }
}) {
  const description = t(`ability_description.${props.ability}`)
  return (
    <p className="ability-description">
      {addIconsToDescription(description, {
        stats: props.stats,
        config: getAbilityConfig(props.ability)
      })}
    </p>
  )
}
