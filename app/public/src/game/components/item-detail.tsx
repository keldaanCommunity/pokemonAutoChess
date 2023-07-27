import { GameObjects } from "phaser"
import React from "react"
import ReactDOM from "react-dom"
import ReactTooltip from "react-tooltip"
import { ItemRecipe, ItemStats } from "../../../../types/Config"
import { Item } from "../../../../types/enum/Item"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import "./item-detail.css"
import { t } from "i18next"

export function ItemDetailTooltip({
  item,
  depth
}: {
  item: Item
  depth: number
}) {
  const recipes = Object.entries(ItemRecipe).filter(([result, recipe]) =>
    recipe.includes(item)
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
    ReactDOM.render(<ItemDetailTooltip item={name} depth={1} />, this.dom)
  }

  setVisible(bool: boolean) {
    // TEMPFIX for https://github.com/photonstorm/phaser/issues/5816
    super.setVisible(bool)
    this.dom.style.visibility = bool ? "visible" : "hidden"
    return this
  }
}
