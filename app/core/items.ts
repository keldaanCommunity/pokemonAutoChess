import { SetSchema } from "@colyseus/schema"

import { CraftableItems, Item, SynergyStones } from "../types/enum/Item"
import { pickRandomIn } from "../utils/random"

export function getWonderboxItems(existingItems: SetSchema<Item>): Item[] {
  const wonderboxItems: Item[] = []
  for (let n = 0; n < 2; n++) {
    const eligibleItems = CraftableItems.filter(
      (i) =>
        !SynergyStones.includes(i) &&
        !wonderboxItems.includes(i) &&
        !existingItems.has(i) &&
        i !== Item.WONDER_BOX
    )
    wonderboxItems.push(pickRandomIn(eligibleItems))
  }
  return wonderboxItems
}
