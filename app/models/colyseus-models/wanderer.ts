import { Schema, type } from "@colyseus/schema"
import { Pkm } from "../../types/enum/Pokemon"
import type { WandererBehavior, WandererType } from "../../types/enum/Wanderer"

export class Wanderer extends Schema {
  @type("string") id: string
  @type("string") pkm: Pkm
  @type("boolean") shiny: boolean = false
  @type("string") type: WandererType
  @type("string") behavior: WandererBehavior
  @type("string") data: string = ""

  constructor({
    id,
    pkm,
    shiny,
    type,
    behavior,
    data
  }: {
    id: string
    pkm: Pkm
    shiny: boolean
    type: WandererType
    behavior: WandererBehavior
    data?: string
  }) {
    super()
    this.id = id
    this.pkm = pkm
    this.shiny = shiny
    this.type = type
    this.behavior = behavior
    this.data = data ?? ""
  }
}
