import { useTranslation } from "react-i18next"
import type { SynergyTier } from "../../../../../config/game/synergies"
import { addIconsToDescription } from "../../utils/descriptions"

export function SynergyTierDescription(props: { tier: SynergyTier }) {
  const { t } = useTranslation()
  const description = t(`effect_description.${props.tier}`)
  return (
    <p className="synergy-description">{addIconsToDescription(description)}</p>
  )
}
