import { Item, SynergyGemsBuried, ToolsBuried } from "../types";
import { chance, pickRandomIn, shuffleArray } from "../utils/random";

export function initBuriedItems() {
  const buriedItems: (Item | null)[] = new Array(24).fill(null)

  // 3 synergy gems
  for (let i = 0; i < 3; i++) {
    buriedItems[i] = pickRandomIn(SynergyGemsBuried)
  }

  // 4 trash (Trash, Leftovers, Coin, Nugget, Fossil Stone)
  for (let i = 3; i < 7; i++) {
    buriedItems[i] = pickRandomIn([
      Item.TRASH,
      Item.LEFTOVERS,
      Item.COIN,
      Item.NUGGET,
      Item.FOSSIL_STONE
    ])
  }

  // 1 precious (tool, treasure box, big nugget)
  buriedItems[7] = chance(1 / 2)
    ? pickRandomIn(ToolsBuried)
    : pickRandomIn([Item.TREASURE_BOX, Item.BIG_NUGGET])

  shuffleArray(buriedItems)
  return buriedItems
}