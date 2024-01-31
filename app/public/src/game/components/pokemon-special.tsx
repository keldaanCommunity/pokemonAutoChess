/* Pokemon sprites not controlled by any player, with custom onPointer */
import PokemonFactory from "../../../../models/pokemon-factory"
import { PokemonActionState } from "../../../../types/enum/Game"
import { Pkm } from "../../../../types/enum/Pokemon"
import { SpecialLobbyRule } from "../../../../types/enum/SpecialLobbyRule"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import { preferences } from "../../preferences"
import { clamp, min } from "../../../../utils/number"
import { PokemonSpecialDetail } from "./pokemon-special-detail"

export default class PokemonSpecial extends PokemonSprite {
  detail: PokemonSpecialDetail | null
  animationManager: AnimationManager
  specialLobbyRule: SpecialLobbyRule | null

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    name: Pkm,
    animationManager: AnimationManager,
    specialLobbyRule: SpecialLobbyRule | null
  ) {
    super(
      scene,
      x,
      y,
      PokemonFactory.createPokemonFromName(name),
      "environment",
      false,
      false
    )

    this.draggable = false
    this.animationManager = animationManager
    this.animationManager.animatePokemon(this, PokemonActionState.IDLE, false)
    this.specialLobbyRule = specialLobbyRule
  }

  onPointerDown(pointer) {
    super.onPointerDown(pointer)
    this.animationManager.animatePokemon(this, PokemonActionState.EMOTE, false)
  }

  openDetail() {
    if (this.specialLobbyRule) {
      const s = this.scene as GameScene
      if (s.lastPokemonDetail && s.lastPokemonDetail != this) {
        s.lastPokemonDetail.closeDetail()
        s.lastPokemonDetail = null
      }

      this.detail = new PokemonSpecialDetail(this.scene, this.specialLobbyRule)
      this.detail.setPosition(
        this.detail.width / 2 + 40,
        min(0)(-this.detail.height / 2 - 40)
      )

      this.detail.removeInteractive()
      this.add(this.detail)
      s.lastPokemonDetail = this
    }
  }

  updateTooltipPosition() {
    if (this.detail) {
      if (this.input && preferences.showDetailsOnHover) {
        this.detail.setPosition(this.input.localX, this.input.localY)
        return
      }

      const absX = this.x + this.detail.width / 2 + 40
      const minX = this.detail.width / 2
      const maxX = window.innerWidth - this.detail.width / 2
      const absY = this.y - this.detail.height / 2 - 40
      const minY = this.detail.height / 2
      const maxY = window.innerHeight - this.detail.height / 2
      const [x, y] = [
        clamp(absX, minX, maxX) - this.x,
        clamp(absY, minY, maxY) - this.y
      ]
      this.detail.setPosition(x, y)
    }
  }
}
