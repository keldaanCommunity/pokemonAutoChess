import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import { AvatarEmotions, Emotion, IPokemonAvatar } from "../../../../types"
import { GamePhaseState } from "../../../../types/enum/Game"
import { throttle } from "../../../../utils/function"
import { SOUNDS, playSound } from "../../pages/utils/audio"
import store from "../../stores"
import { showEmote } from "../../stores/NetworkStore"
import { getAvatarSrc, getAvatarString } from "../../../../utils/avatar"
import GameScene from "../scenes/game-scene"
import EmoteMenu from "./emote-menu"
import LifeBar from "./life-bar"
import PokemonSprite from "./pokemon"
import { preference } from "../../preferences"
import { cc } from "../../pages/utils/jsx"
import { DEPTH } from "../depths"

export default class PokemonAvatar extends PokemonSprite {
  scene: GameScene
  circleHitbox: GameObjects.Ellipse | null = null
  circleTimer: GameObjects.Graphics | null = null
  isCurrentPlayerAvatar: boolean
  emoteBubble: EmoteBubble | null
  emoteMenu: EmoteMenu | null

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    pokemon: IPokemonAvatar,
    playerId: string,
    scouting?: boolean
  ) {
    super(
      scene,
      x,
      y,
      PokemonFactory.createPokemonFromName(pokemon.name, {
        shiny: pokemon.shiny
      }),
      playerId,
      false,
      false
    )
    this.scene = scene
    this.shouldShowTooltip = false
    this.draggable = false
    this.emoteBubble = null
    this.emoteMenu = null
    this.isCurrentPlayerAvatar = this.playerId === scene.uid
    if (scene.room?.state.phase === GamePhaseState.TOWN) {
      this.drawCircles()
    } else if (!scouting) {
      this.drawLifebar()
    }
    if (this.isCurrentPlayerAvatar) {
      this.registerKeys()
    } else {
      this.disableInteractive()
    }
    this.setDepth(DEPTH.POKEMON)
    this.sendEmote = throttle(this.sendEmote, 1000).bind(this)
  }

  registerKeys() {
    let onKeyA,
      onKeyCtrl,
      onKeyCtrlUp,
      onNumKey = {}
    this.scene.input.keyboard!.on(
      "keydown-A",
      (onKeyA = () => {
        if (this.isCurrentPlayerAvatar && this.scene && this.scene.game) {
          this.playAnimation()
        }
      })
    )
    this.scene.input.keyboard!.on(
      "keydown-CTRL",
      (onKeyCtrl = () => {
        if (this.isCurrentPlayerAvatar && this.scene?.game) {
          this.showEmoteMenu()
        }
      })
    )

    this.scene.input.keyboard!.on(
      "keyup-CTRL",
      (onKeyCtrlUp = () => {
        this.hideEmoteMenu()
      })
    )

    const NUM_KEYS = [
      "ONE",
      "TWO",
      "THREE",
      "FOUR",
      "FIVE",
      "SIX",
      "SEVEN",
      "EIGHT",
      "NINE"
    ]
    NUM_KEYS.forEach((keycode, i) => {
      onNumKey[i] = (event) => {
        if (this.isCurrentPlayerAvatar && this.scene?.game && event.ctrlKey) {
          event.preventDefault()
          this.sendEmote(AvatarEmotions[i])
        }
      }
      this.scene.input.keyboard!.on("keydown-" + keycode, onNumKey[i])
      this.scene.input.keyboard!.on("keydown-NUMPAD_" + keycode, onNumKey[i])
    })

    // do not forget to clean up parent listeners after destroy
    this.sprite.once("destroy", () => {
      this.scene.input.keyboard!.off("keydown-A", onKeyA)
      this.scene.input.keyboard!.off("keydown-CTRL", onKeyCtrl)
      this.scene.input.keyboard!.off("keyup-CTRL", onKeyCtrlUp)
      NUM_KEYS.forEach((keycode, i) => {
        this.scene.input.keyboard!.off("keydown-" + keycode, onNumKey[i])
        this.scene.input.keyboard!.off("keydown-NUMPAD_" + keycode, onNumKey[i])
      })
    })
  }

  drawCircles() {
    const scene = this.scene as GameScene
    this.circleHitbox = new GameObjects.Ellipse(scene, 0, 0, 50, 50)
    this.add(this.circleHitbox)
    this.circleHitbox.setDepth(DEPTH.INDICATOR_BELOW_POKEMON)
    this.circleHitbox.setVisible(
      scene.room?.state.phase === GamePhaseState.TOWN
    )
    this.circleTimer = new GameObjects.Graphics(scene)
    this.add(this.circleTimer)
    this.circleTimer.setDepth(DEPTH.INDICATOR_BELOW_POKEMON)
    if (this.isCurrentPlayerAvatar) {
      this.circleHitbox.setStrokeStyle(2, 0xffffff, 0.8)
    } else {
      this.circleHitbox.setStrokeStyle(1, 0xffffff, 0.5)
    }
  }

  updateCircleTimer(timer: number) {
    if (timer <= 0) {
      this.circleTimer?.destroy()
      if (this.isCurrentPlayerAvatar) {
        playSound(SOUNDS.CAROUSEL_UNLOCK)
      }
    } else {
      this.circleTimer?.clear()
      this.circleTimer?.lineStyle(
        8,
        0x32ffea,
        this.isCurrentPlayerAvatar ? 0.8 : 0.5
      )
      this.circleTimer?.beginPath()

      const angle = (Math.min(timer, 8000) / 8000) * Math.PI * 2
      this.circleTimer?.arc(0, 0, 30, 0, angle)
      this.circleTimer?.strokePath()
    }
  }

  updateLife(life: number) {
    this.lifebar?.setAmount(life)
  }

  drawSpeechBubble(emoteAvatar: string, isOpponent: boolean) {
    if (this.emoteMenu) {
      this.emoteMenu.destroy()
      this.emoteMenu = null
    }

    this.emoteBubble = new EmoteBubble(this.scene, emoteAvatar, isOpponent)
    this.add(this.emoteBubble)

    const x = isOpponent ? -40 : +40
    const y = isOpponent ? +100 : -120
    this.emoteBubble.setPosition(x, y)

    setTimeout(() => {
      if (this.emoteBubble) {
        this.emoteBubble.destroy()
        this.emoteBubble = null
      }
    }, 3000)
  }

  drawLifebar() {
    this.lifebar = new LifeBar(
      this.scene,
      0,
      28,
      60,
      100,
      0,
      this.isCurrentPlayerAvatar ? 0 : 1,
      false
    )
    this.add(this.lifebar)
  }

  showEmoteMenu() {
    if (this.isCurrentPlayerAvatar && !this.emoteMenu) {
      this.emoteMenu = new EmoteMenu(
        this.scene as GameScene,
        this.index,
        this.shiny,
        this.sendEmote
      )
      this.add(this.emoteMenu)
    }
  }

  hideEmoteMenu() {
    if (this.emoteMenu) {
      this.emoteMenu.destroy()
      this.emoteMenu = null
    }
  }

  toggleEmoteMenu() {
    if (this.emoteMenu) this.hideEmoteMenu()
    else this.showEmoteMenu()
  }

  sendEmote(emotion: Emotion) {
    const state = store.getState()
    if (state.game.emotesUnlocked.includes(emotion)) {
      store.dispatch(
        showEmote(getAvatarString(this.index, this.shiny, emotion))
      )
      this.hideEmoteMenu()
    }
  }

  playAnimation() {
    try {
      store.dispatch(showEmote())
    } catch (err) {
      console.error("could not play animation", err)
    }
  }

  onPointerDown(pointer: Phaser.Input.Pointer, event): void {
    super.onPointerDown(pointer, event)
    const scene = this.scene as GameScene

    if (
      !this.isCurrentPlayerAvatar ||
      scene.room?.state.phase === GamePhaseState.TOWN
    ) {
      return
    }

    if (pointer.rightButtonDown()) {
      this.toggleEmoteMenu()
    } else {
      this.playAnimation()
    }
  }
}

export class EmoteBubble extends GameObjects.DOMElement {
  dom: HTMLDivElement

  constructor(scene: Phaser.Scene, emoteAvatar: string, isOpponent: boolean) {
    super(scene, 0, 0)

    this.dom = document.createElement("div")
    this.dom.className =
      "game-emote-bubble " + (isOpponent ? "opponent" : "current")

    const emoteImg = document.createElement("img")
    emoteImg.src = getAvatarSrc(emoteAvatar)
    emoteImg.className = cc({ pixelated: !preference("antialiasing") })

    this.dom.appendChild(emoteImg)
    this.setElement(this.dom)
  }
}
