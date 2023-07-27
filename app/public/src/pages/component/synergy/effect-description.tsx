import React from "react"
import { Effect } from "../../../../../types/enum/Effect"
import { addIconsToDescription } from "../../utils/descriptions"
import "./synergy-description.css"
import { t } from "i18next"

export function EffectDescriptionComponent(props: { effect: Effect }) {
  const description = t(`effect_description.${props.effect}`)
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
