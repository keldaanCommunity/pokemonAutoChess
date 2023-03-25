import { Schema, type } from "@colyseus/schema"
import { Constraint } from "matter-js"
import { getInformations } from "../../public/src/utils"
import { IPokemonAvatar } from "../../types"
import { Orientation, PokemonActionState } from "../../types/enum/Game"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"

export class PokemonAvatar extends Schema implements IPokemonAvatar {
  @type("string") id: string
  @type("string") name: Pkm = Pkm.RATTATA
  @type("boolean") shiny: boolean
  @type("number") x: number
  @type("number") y: number
  @type("string") action: PokemonActionState = PokemonActionState.IDLE
  @type("string") orientation: Orientation = Orientation.DOWNLEFT
  itemId: string = ""
  timer: number
  constraint: Constraint | undefined

  constructor(id: string, avatar: string, x: number, y: number, timer: number) {
    super()
    this.id = id
    this.x = x
    this.y = y
    this.timer = timer
    const informations = getInformations(avatar)
    Object.keys(PkmIndex).forEach((pkm_) => {
      const pkm = pkm_ as Pkm
      const index = PkmIndex[pkm]
      if (index === informations.index) {
        this.name = pkm
      }
    })
    this.shiny = informations.shiny
  }
}
