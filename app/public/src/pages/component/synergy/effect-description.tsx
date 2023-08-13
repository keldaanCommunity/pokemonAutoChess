import React from "react"
import { Effect } from "../../../../../types/enum/Effect"
import { addIconsToDescription } from "../../utils/descriptions"
import "./synergy-description.css"
import { useTranslation } from "react-i18next"

export function EffectDescriptionComponent(props: { effect: Effect }) {
  const { t } = useTranslation()
  const description = t(`effect_description.${props.effect}`)
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
