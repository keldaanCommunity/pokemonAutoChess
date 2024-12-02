import { SetSchema } from "@colyseus/schema"
import {
  CraftableItems,
  Item,
  SynergyGivenByItem,
  SynergyStones
} from "../types/enum/Item"
import { pickRandomIn } from "../utils/random"
import { Pokemon } from "../models/colyseus-models/pokemon"

export function getWonderboxItems(existingItems: SetSchema<Item>): Item[] {
  const wonderboxItems: Item[] = []
  for (let n = 0; n < 2; n++) {
    const elligibleItems = CraftableItems.filter(
      (i) =>
        !SynergyStones.includes(i) &&
        !wonderboxItems.includes(i) &&
        !existingItems.has(i) &&
        i !== Item.WONDER_BOX
    )
    wonderboxItems.push(pickRandomIn(elligibleItems))
  }
  return wonderboxItems
}

export function onItemRemoved(item: Item, pokemon: Pokemon) {
  if (item in SynergyGivenByItem) {
    pokemon.types.delete(SynergyGivenByItem[item])
  }
}
