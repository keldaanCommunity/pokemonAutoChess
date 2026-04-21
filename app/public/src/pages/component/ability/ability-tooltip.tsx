import { useTranslation } from "react-i18next"
import { getAbilityDescriptionParams } from "../../../../../types/ability-params"
import { Ability } from "../../../../../types/enum/Ability"
import { addIconsToDescription } from "../../utils/descriptions"
import "./ability-tooltip.css"

export function AbilityTooltip(props: {
  ability: Ability
  stats?: { stars: number; stages: number; ap: number; luck: number }
}) {
  const { t } = useTranslation()
  const description = t(
    `ability_description.${props.ability}`,
    getAbilityDescriptionParams(props.ability)
  )
  return (
    <p className="ability-description">
      {addIconsToDescription(description, props.stats)}
    </p>
  )
}
