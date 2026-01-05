import { GameObjects } from "phaser"
import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { ItemStats } from "../../../../config"
import { Stat } from "../../../../types/enum/Game"
import {
  ConsumableItems,
  Item,
  ItemComponents,
  ItemRecipe,
  RemovableItems,
  ShinyItems,
  UnholdableItems
} from "../../../../types/enum/Item"
import { isIn } from "../../../../utils/array"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import "./item-detail.css"

export function ItemDetailTooltipContent({
  item,
  showItemCombinationsTooltip = true
}: {
  item: Item
  showItemCombinationsTooltip?: boolean
}) {
  const { t } = useTranslation()
  const recipes = useMemo(
    () =>
      Object.entries(ItemRecipe).filter(([, recipe]) => recipe.includes(item)),
    [item]
  )

  const formatStat = (stat: Stat, value: number) => {
    let output = value.toString()
    if ([Stat.CRIT_CHANCE, Stat.CRIT_POWER].includes(stat)) {
      output += "%"
    }
    if (value >= 0) {
      output = "+" + output
    }
    return output
  }

  const itemCategoryLabel = useMemo(() => {
    if (ConsumableItems.includes(item)) return t("consumable_item")
    if (isIn(UnholdableItems, item)) return t("unholdable_item")
    if (isIn(RemovableItems, item)) return t("removable_item")
    if (isIn(ItemComponents, item)) return t("item_component")
    if (isIn(ShinyItems, item)) return t("shiny")
    return null
  }, [item, t])

  return (
    <div className="game-item-detail">
      <img className="game-item-detail-icon" src={`assets/item/${item}.png`} />
      <div className="game-item-detail-name">
        {ItemRecipe[item] && (
          <div className="game-item-recipe">
            {ItemRecipe[item]?.map((item, i) => (
              <React.Fragment key={`component_${i}_${item}`}>
                <img
                  className="game-item-detail-icon"
                  src={`assets/item/${item}.png`}
                  key={item}
                />
                {i === 0 && " + "}
              </React.Fragment>
            ))}
          </div>
        )}
        {t(`item.${item}`)}
      </div>
      <div className="game-item-detail-stats">
        {itemCategoryLabel && <i>{itemCategoryLabel}</i>}
        {Object.entries(ItemStats[item] ?? {}).map(([stat, value]) => (
          <div key={stat}>
            <img
              src={`assets/icons/${stat}.png`}
              alt={stat}
              title={t(`stat.${stat}`)}
            />
            <span>{formatStat(stat as Stat, value)}</span>
          </div>
        ))}
      </div>
      <p className="game-item-detail-description">
        {addIconsToDescription(t(`item_description.${item}`))}
      </p>
      {recipes.length > 0 && showItemCombinationsTooltip && (
        <div className="game-item-detail-combinations">
          {recipes.map(([result, recipe]) => {
            const otherComponent = recipe[0] == item ? recipe[1] : recipe[0]
            return (
              <div className="game-item-detail-combination" key={result}>
                <p>+</p>
                <img
                  src={`assets/item/${otherComponent}.png`}
                  data-tooltip-id="item-detail-recipes-tooltip"
                  data-tooltip-content={otherComponent}
                  data-tooltip-place="right"
                />
                <p>=</p>
                <img
                  src={`assets/item/${result}.png`}
                  data-tooltip-id="item-detail-recipes-tooltip"
                  data-tooltip-content={result}
                />
              </div>
            )
          })}
        </div>
      )}
      <Tooltip
        id="item-detail-recipes-tooltip"
        className="custom-theme-tooltip item-detail-tooltip"
        render={({ content }) => (
          <ItemDetailTooltipContent
            item={content as Item}
            showItemCombinationsTooltip={false}
          />
        )}
      />
    </div>
  )
}

export function ItemDetailTooltip() {
  return (
    <Tooltip
      id="item-detail-tooltip"
      className="custom-theme-tooltip item-detail-tooltip"
      render={({ content }) => (
        <ItemDetailTooltipContent item={content as Item} />
      )}
    />
  )
}

export default class ItemDetail extends GameObjects.DOMElement {
  dom: HTMLDivElement
  constructor(scene: Phaser.Scene, x: number, y: number, name: Item) {
    super(scene, x, y)
    this.dom = document.createElement("div")
    this.dom.className = "my-container item-detail-tooltip"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(<ItemDetailTooltipContent item={name} />)
  }
}
