import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { IPokemonAvatar } from "../../../../types"
import { GamePhaseState } from "../../../../types/enum/Game"
import { max } from "../../../../utils/number"
import { playSound, SOUNDS } from "../../pages/utils/audio"
import { getAvatarSrc } from "../../utils"
import GameScene from "../scenes/game-scene"
import Pokemon from "./pokemon"

export default class PokemonAvatar extends Pokemon {
  circleHitbox: GameObjects.Ellipse | undefined
  circlePartial: GameObjects.Graphics
  isCurrentPlayerAvatar: boolean
  emoteBubble: EmoteBubble | null

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    pokemon: IPokemonAvatar,
    playerId: string
  ) {
    super(
      scene,
      x,
      y,
      PokemonFactory.createPokemonFromName(pokemon.name),
      playerId,
      false
    )
    this.shouldShowTooltip = false
    this.draggable = false
    this.emoteBubble = null
    this.isCurrentPlayerAvatar = this.playerId === scene.uid
    this.drawCircles()
  }

  drawCircles() {
    const scene = this.scene as GameScene
    this.circleHitbox = new GameObjects.Ellipse(scene, 0, 0, 50, 50)
    this.add(this.circleHitbox)
    this.circleHitbox.setVisible(
      scene.room?.state.phase === GamePhaseState.MINIGAME
    )
    this.circlePartial = new GameObjects.Graphics(scene)
    this.add(this.circlePartial)
    if (this.isCurrentPlayerAvatar) {
      this.circleHitbox.setStrokeStyle(2, 0xffffff, 0.8)
    } else {
      this.circleHitbox.setStrokeStyle(1, 0xffffff, 0.5)
    }
  }

  updateCircleTimer(timer: number) {
    if (timer <= 0) {
      this.circlePartial.destroy()
      if (this.isCurrentPlayerAvatar) {
        playSound(SOUNDS.CAROUSEL_UNLOCK)
      }
    } else {
      this.circlePartial.clear()
      this.circlePartial.lineStyle(
        8,
        0xf7d51d,
        this.isCurrentPlayerAvatar ? 0.8 : 0.5
      )
      this.circlePartial.beginPath()

      const angle = (Math.min(timer, 8000) / 8000) * Math.PI * 2
      this.circlePartial.arc(0, 0, 30, 0, angle)
      this.circlePartial.strokePath()
    }
  }

  updateCircleLife(life: number) {
    this.circlePartial.clear()
    this.circlePartial.lineStyle(
      8,
      this.isCurrentPlayerAvatar ? 0x01ff01 : 0xf7d51d,
      0.8
    )
    this.circlePartial.beginPath()

    const angle = (Math.PI * 2 * max(100)(life)) / 100
    this.circlePartial.arc(0, 0, 30, 0, angle)
    this.circlePartial.strokePath()
  }

  drawSpeechBubble(emoteAvatar: string, isOpponent: boolean) {
    this.emoteBubble = new EmoteBubble(this.scene, emoteAvatar, this.isCurrentPlayerAvatar)
    this.add(this.emoteBubble)

    const x = isOpponent ? -25 : +25
    const y = isOpponent ? +90 : -90
    this.emoteBubble.setPosition(x, y)

    setTimeout(() => {
      if(this.emoteBubble){
        this.emoteBubble.destroy()
        this.emoteBubble = null
      } 
    }, 3000)
  }
}

export class EmoteBubble extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, emoteAvatar: string, isCurrentPlayerAvatar: boolean){
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className = "game-emote-bubble " + (isCurrentPlayerAvatar ? "current" : "opponent")

    const emoteImg = document.createElement("img")
    emoteImg.src = getAvatarSrc(emoteAvatar)

    this.dom.appendChild(emoteImg)
    this.setElement(this.dom)
  }
}