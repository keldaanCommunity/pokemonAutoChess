import { GameObjects } from "phaser"
import React from "react"
import ReactDOM from "react-dom/client"
import { addIconsToDescription } from "../../pages/utils/descriptions"

export class PokemonSpecialDetail extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, dialog: string, dialogTitle?: string) {
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className = "nes-container game-pokemon-dialog"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(
      <>
        {dialogTitle && (
          <div className="game-pokemon-dialog-title">
            <p>{dialogTitle}</p>
          </div>
        )}
        <div className="game-pokemon-dialog-text">
          {addIconsToDescription(dialog)}
        </div>
      </>
    )
  }
}
