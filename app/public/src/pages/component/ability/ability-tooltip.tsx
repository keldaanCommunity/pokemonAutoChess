import React from "react"
import { Ability } from "../../../../../types/enum/Ability"
import { addIconsToDescription } from "../../utils/descriptions"
import "./ability-tooltip.css"
import { t } from "i18next"

export function AbilityTooltip(props: {
  ability: Ability
  tier?: number
  ap?: number
}) {
  const description = t(`ability_description.${props.ability}`)
  return (
    <p className="ability-description">
      {addIconsToDescription(description, props.tier, props.ap)}
    </p>
  )
}
