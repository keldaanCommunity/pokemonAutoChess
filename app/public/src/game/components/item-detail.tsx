import { GameObjects } from "phaser"
import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { ItemStats } from "../../../../core/items"
import { Stat } from "../../../../types/enum/Game"
import { HMs, Item, ItemRecipe, TMs } from "../../../../types/enum/Item"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import { cc } from "../../pages/utils/jsx"
import { usePreferences } from "../../preferences"
import "./item-detail.css"

export function ItemDetailTooltip({
  item,
  depth = 1
}: {
  item: Item
  depth?: number
}) {
  const [preferences] = usePreferences()
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

  const getImageFilename = () => {
    if (TMs.includes(item)) { return "TM" }
    if (HMs.includes(item)) { return "HM" }
    return item
  }

  return (
    <div className="game-item-detail">
      <img
        className={cc("game-item-detail-icon", {
          pixelated: !preferences.antialiasing
        })}
        src={`assets/item/${getImageFilename()}.png`}
      />
      <div className="game-item-detail-name">
        {ItemRecipe[item] && (
          <div className="game-item-recipe">
            {ItemRecipe[item]?.map((item, i) => (
              <React.Fragment key={`component_${i}_${item}`}>
                <img
                  className={cc("game-item-detail-icon", {
                    pixelated: !preferences.antialiasing
                  })}
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
