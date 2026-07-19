import type { Ability } from "../../../../../types/enum/Ability"
import { translateAbilityDescription } from "../../utils/ability-description"
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
  const description = translateAbilityDescription(props.ability)
  return (
    <p className="ability-description">
      {addIconsToDescription(description, props.stats)}
    </p>
  )
}
