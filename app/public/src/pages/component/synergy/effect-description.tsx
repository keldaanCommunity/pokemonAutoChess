import React from "react"
import { Effect } from "../../../../../types/enum/Effect"
import { EffectDescription } from "../../../../../types/strings/Effect"
import { addIconsToDescription } from "../../utils/descriptions"
import "./synergy-description.css"

export function EffectDescriptionComponent(props: { effect: Effect }) {
  const description = EffectDescription[props.effect].eng
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
