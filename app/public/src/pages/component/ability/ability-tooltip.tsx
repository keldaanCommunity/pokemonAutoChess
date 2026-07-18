import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const description = translateAbilityDescription(t, props.ability)
  return (
    <p className="ability-description">
      {addIconsToDescription(description, props.stats)}
    </p>
  )
}
