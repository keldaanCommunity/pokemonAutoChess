import { Item, SynergyStones, CraftableItems } from "../types/enum/Item"
import { SetSchema } from "@colyseus/schema"
import { pickRandomIn } from "../utils/random"

export default class ItemFactory {
  static createWonderboxItems(existingItems: SetSchema<Item>): Item[] {
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
}
