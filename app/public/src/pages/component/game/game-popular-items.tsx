import React, { useMemo } from "react"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getGameScene } from "../../game"
import { Item } from "../../../../../types/enum/Item"
import { usePreference } from "../../../preferences"
import { cc } from "../../utils/jsx"
import { Tooltip } from "react-tooltip"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { useTranslation } from "react-i18next"

export default function GamePopularItems(props: { pokemon: Pkm }) {
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()

  const popularItems = useMemo(() => {
    const scene = getGameScene()
    if (!scene) return null

    const map: Map<Pkm, Item[]> = scene.cache.json.get("meta-pokemon")
    if (!map) return null

    const itemList = map.get(props.pokemon)
    if (!itemList) return null

    return itemList.slice(0, 5)
  }, [props.pokemon])

  return (
    <div className="game-pokemon-detail-popular-items">
      {!!popularItems?.length && (
        <>
          <div className="game-pokemon-detail-popular-items-header">
            {t("popular_items")}:
          </div>
          <div className="game-pokemon-detail-popular-items-items">
            {popularItems.map((item) => (
              <img
                key={item}
                src={"assets/item/" + item + ".png"}
                className={cc("game-pokemon-detail-popular-items-item", {
                  pixelated: !antialiasing
                })}
                data-tooltip-id="tooltip-game-pokemon-detail-item"
                data-item={item}
              ></img>
            ))}
          </div>

          <Tooltip
            render={({ activeAnchor }) =>
              !!activeAnchor && (
                <ItemDetailTooltip item={activeAnchor.dataset.item as Item} />
              )
            }
            id="tooltip-game-pokemon-detail-item"
            className="custom-theme-tooltip item-detail-tooltip"
          />
        </>
      )}
    </div>
  )
}