import { Schema, type } from "@colyseus/schema"
import type { Item } from "../../types/enum/Item"
import type { PkmProposition } from "../../types/enum/Pokemon"

export type PlayerChoiceType =
  | "item"
  | "addPick"
  | "starter"
  | "unique"
  | "legendary"
  | "mission_order"
  | "wand"
  | "gifts"

export class PlayerChoice extends Schema {
  @type("string") id: string
  @type("string") type: PlayerChoiceType
  @type(["string"]) items: Item[] = []
  @type(["string"]) pokemons: PkmProposition[] = []
  @type(["number"]) costs: number[] = []

  constructor(args: {
    type: PlayerChoiceType
    items?: Item[]
    pokemons?: PkmProposition[]
    costs?: number[]
  }) {
    super()
    this.id = crypto.randomUUID()
    this.type = args.type
    if (args.items) this.items = args.items
    if (args.pokemons) this.pokemons = args.pokemons
    if (args.costs) this.costs = args.costs
  }
}
