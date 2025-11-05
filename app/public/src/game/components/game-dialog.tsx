import { GameObjects } from "phaser"
import React from "react"
import ReactDOM from "react-dom/client"
import PokemonPortrait, {
  PortraitOptions
} from "../../pages/component/pokemon-portrait"
import { addIconsToDescription } from "../../pages/utils/descriptions"

export class GameDialog extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor({
    scene,
    dialog,
    dialogTitle,
    portrait,
    extraClass
  }: {
    scene: Phaser.Scene
    dialog: string
    dialogTitle?: string
    portrait?: PortraitOptions
    extraClass?: string
  }) {
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className = `my-container game-dialog ${extraClass ?? ""}`
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(
      <>
        {portrait && (
          <div className="game-dialog-portrait">
            <PokemonPortrait portrait={portrait} />
          </div>
        )}
        {dialogTitle && (
          <div className="game-dialog-title">
            <p>{dialogTitle}</p>
          </div>
        )}
        <div className="game-dialog-text">{addIconsToDescription(dialog)}</div>
      </>
    )
  }
}
