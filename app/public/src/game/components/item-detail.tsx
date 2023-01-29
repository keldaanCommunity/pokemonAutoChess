import { GameObjects } from "phaser"
import React from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";
import { ItemDescription, ItemName } from "../../../../types/strings/Item"
import { ItemRecipe, ItemStats } from "../../../../types/Config"
import { Item } from "../../../../types/enum/Item";
import { Stat } from "../../../../types/enum/Game";
import "./item-detail.css";
import { StatLabel } from "../../../../types/strings/Stat";

export function ItemDetailTooltip({ item, depth }: { item: Item, depth: number }){
  const recipes = Object.entries(ItemRecipe).filter(([result, recipe]) => recipe.includes(item))
  let stats: { [stat in Stat]?: number } = {}
  if(item in ItemRecipe){
    ItemRecipe[item]!.forEach(component => {
      for(let stat in ItemStats[component]){
        stats[stat] = (stats[stat] ?? 0) + ItemStats[component]![stat]
      }
    })
  } else {
    stats = { ...ItemStats[item] }
  }

  return <div className="game-item-detail">
  <img className="game-item-detail-icon" src={`assets/item/${item}.png`}/>
  <p className="game-item-detail-name">{ItemName[item]}</p>
  <div className="game-item-detail-stats">
    {Object.entries(stats).map(([stat, value]) => (<div key={stat}>
      <img src={`assets/icons/${stat}.png`} alt={stat} title={StatLabel[stat]["eng"]} />
      <span>+{value}</span>
    </div>))}
  </div>
  <p className="game-item-detail-description">{ItemDescription[item]}</p>
  {recipes.length > 0 && depth <= 1 && (<div className="game-item-detail-combinations">
    {recipes.map(([result, recipe]) => {
      const otherComponent = recipe[0] == item ? recipe[1] : recipe[0]
      return <div className="game-item-detail-combination" key={result}>
        <p>+</p>
        <img src={`assets/item/${otherComponent}.png`} data-tip data-for={"item-tooltip-" + otherComponent} />
        <ReactTooltip id={"item-tooltip-" + otherComponent} effect="float" place="right" className="customeTheme item-detail-tooltip">
            <ItemDetailTooltip item={otherComponent} depth={depth+1} />
        </ReactTooltip>
        <p>=</p>
        <img src={`assets/item/${result}.png`} data-tip data-for={"item-tooltip-" + result} />
        <ReactTooltip id={"item-tooltip-" + result} effect="float" place="right" className="customeTheme item-detail-tooltip">
          <ItemDetailTooltip item={result as Item} depth={depth+1} />
        </ReactTooltip>
      </div>
    })}
  </div>)}      
</div>
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
}
