/* Pokemon sprites not controlled by any player, with custom onPointer */
import PokemonFactory from "../../../../models/pokemon-factory"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"
import { Pkm } from "../../../../types/enum/Pokemon"
import { clamp, min } from "../../../../utils/number"
import { preference } from "../../preferences"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import { GameDialog } from "./game-dialog"

export default class PokemonSpecial extends PokemonSprite {
  detail: GameDialog | null = null
  scene: GameScene
  dialog?: string
  dialogTitle?: string

  constructor({ scene, x, y, name, orientation = Orientation.DOWN, animation = PokemonActionState.IDLE, dialog, dialogTitle, shiny }: {
    scene: GameScene,
    x: number,
    y: number,
    name: Pkm,
    orientation?: Orientation,
    animation?: PokemonActionState,
    dialog?: string,
    dialogTitle?: string
    shiny?: boolean
  }) {
    super(
      scene,
      x + 24,
      y + 24,
      PokemonFactory.createPokemonFromName(name, { shiny }),
      "environment",
      false,
      false
    )

    this.scene = scene
    this.draggable = false
    this.orientation = orientation
    scene.animationManager?.animatePokemon(this, animation, false)
    this.dialog = dialog
    this.dialogTitle = dialogTitle
  }

  onPointerDown(pointer, event) {
    super.onPointerDown(pointer, event)
    event.stopPropagation()
    this.scene.animationManager?.animatePokemon(this, PokemonActionState.EMOTE, false, false)
  }

  openDetail() {
    if (this.dialog) {
      const s = this.scene as GameScene
      if (s.lastPokemonDetail && s.lastPokemonDetail != this) {
        s.lastPokemonDetail.closeDetail()
        s.lastPokemonDetail = null
      }

      this.detail = new GameDialog(
        this.scene,
        this.dialog,
        this.dialogTitle
      )
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
      if (this.input && preference("showDetailsOnHover")) {
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
