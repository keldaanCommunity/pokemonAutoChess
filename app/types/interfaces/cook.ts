import type { Delayed } from "colyseus"
import type { Item } from "../enum/Item"

export interface Cook {
  cookingProcess: Delayed
  dishesMade: Item[]
  fedPokemonsId: string[]
}
