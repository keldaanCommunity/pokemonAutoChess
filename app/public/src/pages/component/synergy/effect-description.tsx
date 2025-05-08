import React from "react"
import { useTranslation } from "react-i18next"
import { EffectEnum } from "../../../../../types/enum/Effect"
import { addIconsToDescription } from "../../utils/descriptions"

export function EffectDescriptionComponent(props: { effect: EffectEnum }) {
  const { t } = useTranslation()
  const description = t(`effect_description.${props.effect}`)
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
