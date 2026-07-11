import { Item } from "./Item"

export const FreeGifts = [
  Item.BERRY_BUNDLE,
  Item.UNOWN_BUNDLE,
  Item.SWEETS_BUNDLE,
  Item.DITTO_BUNDLE,
  Item.TICKET_BUNDLE,
  Item.HATCH_BUNDLE,
  Item.REGION_BUNDLE,
  Item.COOKING_BUNDLE
] as const

export const PaidGifts = [
  Item.GEMS_BUNDLE,
  Item.POTION,
  Item.DELUXE_BOX,
  Item.TOOL_BUNDLE,
  Item.EXP_BUNDLE,
  Item.EVOLVE_BUNDLE,
  Item.COMMON_BUNDLE,
  Item.UNCOMMON_BUNDLE,
  Item.RARE_BUNDLE,
  Item.EPIC_BUNDLE,
  Item.ULTRA_BUNDLE,
  Item.UNIQUE_BUNDLE,
  Item.LEGENDARY_BUNDLE
] as const

export const Gifts = [...FreeGifts, ...PaidGifts]

export type FreeGift = (typeof FreeGifts)[number]
export type PaidGift = (typeof PaidGifts)[number]

export const GiftShopPrices: { [key in Gift]: number } = {
  [Item.BERRY_BUNDLE]: 0,
  [Item.UNOWN_BUNDLE]: 0,
  [Item.SWEETS_BUNDLE]: 0,
  [Item.DITTO_BUNDLE]: 0,
  [Item.TICKET_BUNDLE]: 0,
  [Item.HATCH_BUNDLE]: 0,
  [Item.REGION_BUNDLE]: 0,
  [Item.COOKING_BUNDLE]: 0,

  [Item.EVOLVE_BUNDLE]: 15,
  [Item.GEMS_BUNDLE]: 5,
  [Item.POTION]: 5,
  [Item.DELUXE_BOX]: 15,
  [Item.TOOL_BUNDLE]: 20,
  [Item.COMMON_BUNDLE]: 15,
  [Item.UNCOMMON_BUNDLE]: 6,
  [Item.RARE_BUNDLE]: 9,
  [Item.EPIC_BUNDLE]: 12,
  [Item.ULTRA_BUNDLE]: 5,
  [Item.UNIQUE_BUNDLE]: 15,
  [Item.LEGENDARY_BUNDLE]: 50,
  [Item.EXP_BUNDLE]: 20
}

export type Gift = FreeGift | PaidGift
