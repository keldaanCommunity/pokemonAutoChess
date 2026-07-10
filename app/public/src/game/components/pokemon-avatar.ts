import type Phaser from "phaser"
import { GameObjects } from "phaser"
import PokemonFactory from "../../../../models/pokemon-factory"
import {
  AvatarEmotions,
  Emotion,
  type IPokemonAvatar
} from "../../../../types"
import { GamePhaseState } from "../../../../types/enum/Game"
import { getAvatarString } from "../../../../utils/avatar"
import { throttle } from "../../../../utils/function"
import { showEmote } from "../../network"
import { playSound, SOUNDS } from "../../pages/utils/audio"
import { preference } from "../../preferences"
import store from "../../stores"
import { DEPTH } from "../depths"
import type GameScene from "../scenes/game-scene"
import { EmoteBubble } from "./emote-bubble"
import EmoteMenu from "./emote-menu"
import LifeBar from "./life-bar"
import PokemonSprite from "./pokemon"
import { Item, ItemComponents } from "../../../../types/enum/Item"

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
    this.sendItemEmote = this.sendItemEmote.bind(this)
    this.sendTextEmote = this.sendTextEmote.bind(this)
    this.sendDittoEmote = this.sendDittoEmote.bind(this)
  }

  registerKeys() {
    const keybindings = preference("keybindings")
    let onKeyA,
      onKeyCtrl,
      onKeyCtrlUp,
      onNumKey = {}
    this.scene.input.keyboard!.on(
      "keydown-" + keybindings.emote,
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
      this.scene.input.keyboard!.off("keydown-" + keybindings.emote, onKeyA)
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
    this.lifebar?.setHp(life)
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
      100,
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
        this.pokemon.index,
        this.pokemon.shiny,
        this.sendEmote,
        this.sendItemEmote,
        this.sendTextEmote,
        this.sendDittoEmote

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
      showEmote(
        getAvatarString(this.pokemon.index, this.pokemon.shiny, emotion)
      )
      this.hideEmoteMenu()
    }
  }

  playAnimation() {
    try {
      showEmote()
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

  sendDittoEmote() {
    showEmote(getAvatarString("0132", false, Emotion.NORMAL))
    this.hideEmoteMenu()
  }
  sendItemEmote(item: Item) {
    console.log("sendItemEmote", item)
    showEmote("item/" + item)
    this.hideEmoteMenu()
  }
  sendTextEmote(text: string) {
    showEmote("text/" + text)
    this.hideEmoteMenu()
  }
}
