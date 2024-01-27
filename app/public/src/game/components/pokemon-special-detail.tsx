import { t } from "i18next"
import { GameObjects } from "phaser"
import React from "react"
import ReactDOM from "react-dom/client"
import { SpecialLobbyRule } from "../../../../types/enum/SpecialLobbyRule"
import { addIconsToDescription } from "../../pages/utils/descriptions"

export class PokemonSpecialDetail extends GameObjects.DOMElement {
    dom: HTMLDivElement
  
    constructor(scene: Phaser.Scene, specialRule: SpecialLobbyRule) {
      super(scene, 0, 0)
  
      this.dom = document.createElement("div")
      this.dom.className = "nes-container game-special-rule"
      this.setElement(this.dom)
      const root = ReactDOM.createRoot(this.dom)
      root.render(
        <>
          <div className="rule-name">
            <p>{t(`scribble.${specialRule}`)}</p>
          </div>
          <div className="rule-desc">
            {addIconsToDescription(t(`scribble_description.${specialRule}`))}
          </div>
        </>
      )
    }
  }
  