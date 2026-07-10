import { GameObjects } from "phaser"
import { getAvatarSrc } from "../../../../utils/avatar"

export class EmoteBubble extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, emoteAvatar: string, isOpponent: boolean) {
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className =
      "game-emote-bubble " + (isOpponent ? "opponent" : "current")

    const emoteImg = document.createElement("img")
    emoteImg.src = emoteAvatar.startsWith("item/")
      ? `assets/${emoteAvatar}.png`
      : getAvatarSrc(emoteAvatar)

    this.dom.appendChild(emoteImg)
    this.setElement(this.dom)
  }
}
