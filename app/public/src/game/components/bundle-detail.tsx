import { useTranslation } from "react-i18next"
import type { ArmoryOptions } from "../../../../types/enum/ArmoryOptions"
import { Tooltip } from "react-tooltip"
import "./item-detail.css"
import { addIconsToDescription } from "../../pages/utils/descriptions"

export function BundleDetailTooltipContent({ item }: { item: ArmoryOptions }) {
  const { t } = useTranslation()
  return (
    <div className="game-item-detail">
      <img
        className="game-item-detail-icon"
        src={`assets/item/${item}.png`}
        alt={t(`armory.${item}` as any)}
      />
    <div className="game-item-detail-name">
      {t(`armory.${item}` as any)}
    </div>
    <p className="game-item-detail-description">{addIconsToDescription(t(`armory_description.${item}` as any))}</p>    </div>
  )
}

export function BundleDetailTooltip() {
  return (
    <Tooltip
      id="bundle-detail-tooltip"
      className="custom-theme-tooltip item-detail-tooltip"
      render={({ content }) => content ? <BundleDetailTooltipContent item={content as ArmoryOptions} /> : null}
    />
  )
}
