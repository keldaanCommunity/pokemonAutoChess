/* Pokemon sprites not controlled by any player, with custom onPointer */
import PokemonFactory from "../../../../models/pokemon-factory"
import { Emotion } from "../../../../types"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"
import { Pkm } from "../../../../types/enum/Pokemon"
import GameScene from "../scenes/game-scene"
import { GameDialog } from "./game-dialog"
import PokemonSprite from "./pokemon"

export default class PokemonSpecial extends PokemonSprite {
  detail: GameDialog | null = null
  scene: GameScene
  dialog?: string
  dialogTitle?: string

  constructor({
    scene,
    x,
    y,
    name,
    orientation = Orientation.DOWN,
    animation = PokemonActionState.IDLE,
    dialog,
    dialogTitle,
    emotion,
    shiny
  }: {
    scene: GameScene
    x: number
    y: number
    name: Pkm
    orientation?: Orientation
    animation?: PokemonActionState
    dialog?: string
    dialogTitle?: string
    emotion?: Emotion
    shiny?: boolean
  }) {
    super(
      scene,
      x + 24,
      y + 24,
      PokemonFactory.createPokemonFromName(name, { emotion, shiny }),
      "environment",
      false,
      false
    )

    this.scene = scene
    this.draggable = false
    this.orientation = orientation
    this.once("loaded", () =>
      scene.animationManager?.animatePokemon(this, animation, false)
    )
    this.dialog = dialog
    this.dialogTitle = dialogTitle
  }

  onPointerDown(pointer, event) {
    super.onPointerDown(pointer, event)
    event.stopPropagation()
    this.scene.animationManager?.animatePokemon(
      this,
      PokemonActionState.EMOTE,
      false,
      false
    )
  }

  openDetail() {
    if (this.dialog) {
      const s = this.scene as GameScene
      if (s.lastPokemonDetail && s.lastPokemonDetail != this) {
        s.lastPokemonDetail.closeDetail()
        s.lastPokemonDetail = null
      }

      this.detail = new GameDialog({
        scene: this.scene,
        dialog: this.dialog,
        dialogTitle: this.dialogTitle,
        portrait: {
          index: this.pokemon.index,
          shiny: this.pokemon.shiny,
          emotion: this.pokemon.emotion
        }
      })
      this.updateTooltipPosition()
      this.detail.removeInteractive()
      this.add(this.detail)
      s.lastPokemonDetail = this
    }
  }
}
