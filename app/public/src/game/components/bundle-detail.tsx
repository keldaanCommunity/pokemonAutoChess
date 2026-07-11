import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import type { GiftShopOptions } from "../../../../types/enum/GiftShop"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import "./item-detail.css"

export function BundleDetailTooltipContent({
  item
}: {
  item: GiftShopOptions
}) {
  const { t } = useTranslation()
  return (
    <div className="game-item-detail">
      <img
        className="game-item-detail-icon"
        src={`assets/item/${item}.png`}
        alt={t(`item.${item}` as any)}
      />
      <div className="game-item-detail-name">{t(`item.${item}` as any)}</div>
      <p className="game-item-detail-description">
        {addIconsToDescription(t(`item_description.${item}` as any))}
      </p>{" "}
    </div>
  )
}

export function BundleDetailTooltip() {
  return (
    <Tooltip
      id="bundle-detail-tooltip"
      className="custom-theme-tooltip item-detail-tooltip"
      render={({ content }) =>
        content ? (
          <BundleDetailTooltipContent item={content as GiftShopOptions} />
        ) : null
      }
    />
  )
}
