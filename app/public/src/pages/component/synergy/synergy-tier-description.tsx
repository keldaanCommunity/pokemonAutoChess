import { useTranslation } from "react-i18next"
import type { SynergyTier } from "../../../../../config/game/synergies"
import { getDescriptionConfig } from "../../utils/description-config"
import { addIconsToDescription } from "../../utils/descriptions"

export function SynergyTierDescription(props: { tier: SynergyTier }) {
  const { t } = useTranslation()
  const description = t(`effect_description.${props.tier}`)
  const config = getDescriptionConfig(`effect_description.${props.tier}`)
  return (
    <p className="synergy-description">{addIconsToDescription(description, { config })}</p>
  )
}
