import { useTranslation } from "react-i18next"
import { SynergyEffect } from "../../../../../models/effects"
import { addIconsToDescription } from "../../utils/descriptions"

export function EffectDescriptionComponent(props: { effect: SynergyEffect }) {
  const { t } = useTranslation()
  const description = t(`effect_description.${props.effect}`)
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
