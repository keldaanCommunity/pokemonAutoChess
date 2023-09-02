import { GameObjects } from "phaser"
import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import ReactTooltip from "react-tooltip"
import { ItemRecipe, ItemStats } from "../../../../types/Config"
import { Item } from "../../../../types/enum/Item"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import "./item-detail.css"
import { useTranslation } from "react-i18next"

export function ItemDetailTooltip({
  item,
  depth = 1
}: {
  item: Item
  depth?: number
}) {
  const { t } = useTranslation()
  const recipes = useMemo(
    () =>
      Object.entries(ItemRecipe).filter(([, recipe]) => recipe.includes(item)),
    [item]
  )

  return (
    <div className="game-item-detail">
      <img className="game-item-detail-icon" src={`assets/item/${item}.png`} />
      <p className="game-item-detail-name">{t(`item.${item}`)}</p>
      <div className="game-item-detail-stats">
        {Object.entries(ItemStats[item]).map(([stat, value]) => (
          <div key={stat}>
            <img
              src={`assets/icons/${stat}.png`}
              alt={stat}
              title={t(`stat.${stat}`)}
            />
            <span>+{value}</span>
          </div>
        ))}
      </div>
      <p className="game-item-detail-description">
        {addIconsToDescription(t(`item_description.${item}`))}
      </p>
      {recipes.length > 0 && depth <= 1 && (
        <div className="game-item-detail-combinations">
          {recipes.map(([result, recipe]) => {
            const otherComponent = recipe[0] == item ? recipe[1] : recipe[0]
            return (
              <div className="game-item-detail-combination" key={result}>
                <p>+</p>
                <img
                  src={`assets/item/${otherComponent}.png`}
                  data-tip
                  data-for={"item-tooltip-" + otherComponent}
                />
                <ReactTooltip
                  id={"item-tooltip-" + otherComponent}
                  effect="float"
                  place="right"
                  className="customeTheme item-detail-tooltip"
                >
                  <ItemDetailTooltip item={otherComponent} depth={depth + 1} />
                </ReactTooltip>
                <p>=</p>
                <img
                  src={`assets/item/${result}.png`}
                  data-tip
                  data-for={"item-tooltip-" + result}
                />
                <ReactTooltip
                  id={"item-tooltip-" + result}
                  effect="float"
                  place="right"
                  className="customeTheme item-detail-tooltip"
                >
                  <ItemDetailTooltip item={result as Item} depth={depth + 1} />
                </ReactTooltip>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default class ItemDetail extends GameObjects.DOMElement {
  dom: HTMLDivElement
  constructor(scene: Phaser.Scene, x: number, y: number, name: Item) {
    super(scene, x, y)
    this.dom = document.createElement("div")
    this.dom.className = "nes-container"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(<ItemDetailTooltip item={name} />)
  }
}
