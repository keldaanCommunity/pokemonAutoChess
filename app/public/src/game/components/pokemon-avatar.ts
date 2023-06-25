import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { IPokemonAvatar } from "../../../../types"
import { GamePhaseState } from "../../../../types/enum/Game"
import { playSound, SOUNDS } from "../../pages/utils/audio"
import { getAvatarSrc } from "../../utils"
import GameScene from "../scenes/game-scene"
import Pokemon from "./pokemon"
import LifeBar from "./life-bar"
import EmoteMenu from "./emote-menu"

export default class PokemonAvatar extends Pokemon {
  circleHitbox: GameObjects.Ellipse | undefined
  circleTimer: GameObjects.Graphics
  isCurrentPlayerAvatar: boolean
  emoteBubble: EmoteBubble | null
  emoteMenu: EmoteMenu | null

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
    this.emoteMenu = null
    this.isCurrentPlayerAvatar = this.playerId === scene.uid
    if(scene.room?.state.phase === GamePhaseState.MINIGAME){
      this.drawCircles()
    } else {
      this.drawLifebar()
    }
  }

  drawCircles() {
    const scene = this.scene as GameScene
    this.circleHitbox = new GameObjects.Ellipse(scene, 0, 0, 50, 50)
    this.add(this.circleHitbox)
    this.circleHitbox.setDepth(-1)
    this.circleHitbox.setVisible(
      scene.room?.state.phase === GamePhaseState.MINIGAME
    )
    this.circleTimer = new GameObjects.Graphics(scene)
    this.add(this.circleTimer)
    this.circleTimer.setDepth(-1)
    if (this.isCurrentPlayerAvatar) {
      this.circleHitbox.setStrokeStyle(2, 0xffffff, 0.8)
    } else {
      this.circleHitbox.setStrokeStyle(1, 0xffffff, 0.5)
    }
  }

  updateCircleTimer(timer: number) {
    if (timer <= 0) {
      this.circleTimer.destroy()
      if (this.isCurrentPlayerAvatar) {
        playSound(SOUNDS.CAROUSEL_UNLOCK)
      }
    } else {
      this.circleTimer.clear()
      this.circleTimer.lineStyle(
        8,
        0xf7d51d,
        this.isCurrentPlayerAvatar ? 0.8 : 0.5
      )
      this.circleTimer.beginPath()

      const angle = (Math.min(timer, 8000) / 8000) * Math.PI * 2
      this.circleTimer.arc(0, 0, 30, 0, angle)
      this.circleTimer.strokePath()
    }
  }

  updateLife(life: number) {
    this.lifebar?.setAmount(life)
  }

  drawSpeechBubble(emoteAvatar: string, isOpponent: boolean) {
    if(this.emoteMenu){
      this.emoteMenu.destroy()
      this.emoteMenu = null
    }
    
    this.emoteBubble = new EmoteBubble(this.scene, emoteAvatar, isOpponent)
    this.add(this.emoteBubble)

    const x = isOpponent ? -40 : +40
    const y = isOpponent ? +100 : -120
    this.emoteBubble.setPosition(x, y)

    setTimeout(() => {
      if(this.emoteBubble){
        this.emoteBubble.destroy()
        this.emoteBubble = null
      } 
    }, 3000)
  }

  drawLifebar(){
    this.lifebar = new LifeBar(
      this.scene,
      0,
      28,
      60,
      100,
      0,
      this.isCurrentPlayerAvatar ? 0 : 1
    )
    this.add(this.lifebar)
  }

  toggleEmoteMenu() {
    if(this.emoteMenu){
      this.emoteMenu.destroy()
      this.emoteMenu = null
    } else if(this.isCurrentPlayerAvatar){
      this.emoteMenu = new EmoteMenu(this.scene, this.index, this.shiny)
      this.add(this.emoteMenu)
    }
  }
}

export class EmoteBubble extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, emoteAvatar: string, isOpponent: boolean){
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className = "game-emote-bubble " + (isOpponent ? "opponent" : "current")

    const emoteImg = document.createElement("img")
    emoteImg.src = getAvatarSrc(emoteAvatar)

    this.dom.appendChild(emoteImg)
    this.setElement(this.dom)
  }
}