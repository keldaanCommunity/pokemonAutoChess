import { GameObjects } from "phaser"
import { getAvatarSrc } from "../../../../utils/avatar"
import { cc } from "../../pages/utils/jsx"

export class EmoteBubble extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, emoteAvatar: string, isOpponent: boolean) {
    super(scene, 0, 0)

    const isItem = emoteAvatar.startsWith("item/")

    this.dom = document.createElement("div")
    this.dom.className = cc(
      "game-emote-bubble",
      isOpponent ? "opponent" : "current",
      { "item-emote": isItem }
    )

    const emoteImg = document.createElement("img")
    emoteImg.src = isItem
      ? `assets/${emoteAvatar}.png`
      : getAvatarSrc(emoteAvatar)

    this.dom.appendChild(emoteImg)
    this.setElement(this.dom)
  }
}
