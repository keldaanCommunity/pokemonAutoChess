import { GameObjects } from "phaser"
import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { ItemStats } from "../../../../types/Config"
import { Stat } from "../../../../types/enum/Game"
import { Item, ItemRecipe } from "../../../../types/enum/Item"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import "./item-detail.css"

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

  const formatStat = (stat: Stat, value: number) => {
    if ([Stat.CRIT_POWER].includes(stat)) {
      value = Math.round(value * 100)
    }
    let output = value.toString()
    if ([Stat.ATK_SPEED, Stat.CRIT_CHANCE, Stat.CRIT_POWER].includes(stat)) {
      output += "%"
    }
    if (value >= 0) {
      output = "+" + output
    }
    return output
  }

  return (
    <div className="game-item-detail">
      <img className="game-item-detail-icon" src={`assets/item/${item}.png`} />
      <p className="game-item-detail-name">
        {ItemRecipe[item] && (<div className="game-item-recipe">
          {ItemRecipe[item]?.map((item, i) => <><img className="game-item-detail-icon" src={`assets/item/${item}.png`} />{i === 0 && ' + '}</>)}
        </div>)}
        {t(`item.${item}`)}
      </p>
      <div className="game-item-detail-stats">
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
      {recipes.length > 0 && depth <= 1 && (
        <div className="game-item-detail-combinations">
          {recipes.map(([result, recipe]) => {
            const otherComponent = recipe[0] == item ? recipe[1] : recipe[0]
            return (
              <div className="game-item-detail-combination" key={result}>
                <p>+</p>
                <img
                  src={`assets/item/${otherComponent}.png`}
                  data-tooltip-id={"item-tooltip-" + otherComponent}
                />
                <Tooltip
                  id={"item-tooltip-" + otherComponent}
                  float
                  place="right"
                  className="custom-theme-tooltip item-detail-tooltip"
                >
                  <ItemDetailTooltip item={otherComponent} depth={depth + 1} />
                </Tooltip>
                <p>=</p>
                <img
                  src={`assets/item/${result}.png`}
                  data-tooltip-id={"item-tooltip-" + result}
                />
                <Tooltip
                  id={"item-tooltip-" + result}
                  float
                  place="right"
                  className="custom-theme-tooltip item-detail-tooltip"
                >
                  <ItemDetailTooltip item={result as Item} depth={depth + 1} />
                </Tooltip>
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
    this.dom.className = "my-container item-detail-tooltip"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(<ItemDetailTooltip item={name} />)
  }
}
