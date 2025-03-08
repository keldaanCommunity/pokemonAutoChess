import { Schema, type } from "@colyseus/schema"
import { Constraint } from "matter-js"
import { getPokemonCustomFromAvatar } from "../../utils/avatar"
import { IPokemonAvatar } from "../../types"
import { Orientation, PokemonActionState } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"

export class PokemonAvatarModel extends Schema implements IPokemonAvatar {
  @type("string") id: string
  @type("string") name: Pkm
  @type("boolean") shiny: boolean
  @type("number") x: number
  @type("number") y: number
  @type("number") targetX: number
  @type("number") targetY: number
  @type("string") action: PokemonActionState = PokemonActionState.IDLE
  @type("string") orientation: Orientation = Orientation.DOWNLEFT
  @type("number") timer: number
  itemId: string = ""
  portalId: string = ""
  constraint: Constraint | undefined

  constructor(id: string, avatar: string, x: number, y: number, timer: number) {
    super()
    this.id = id
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.timer = timer
    const { name, shiny } = getPokemonCustomFromAvatar(avatar)
    this.name = name
    this.shiny = shiny ?? false
  }
}
