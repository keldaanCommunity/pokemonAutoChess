import React from "react"
import ReactDOM from "react-dom/client"
import { GameObjects } from "phaser"
import { addIconsToDescription } from "../../pages/utils/descriptions"

export class GameDialog extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, dialog: string, dialogTitle?: string, extraClass?: string) {
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className = `my-container game-dialog ${extraClass ?? ""}`
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(
      <>
        {dialogTitle && (
          <div className="game-dialog-title">
            <p>{dialogTitle}</p>
          </div>
        )}
        <div className="game-dialog-text">
          {addIconsToDescription(dialog)}
        </div>
      </>
    )
  }
}
