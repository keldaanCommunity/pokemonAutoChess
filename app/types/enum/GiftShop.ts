import { Item } from "./Item"

export const GiftsTier1 = [
  Item.BERRIES_GIFT,
  Item.SWEETS_GIFT,
  Item.DITTO_GIFT,
  Item.TICKET_BUNDLE,
  Item.HATCH_BUNDLE,
  Item.REGIONAL_TOUR,
  Item.BANQUET,
  Item.SMALL_EXP_GIFT
] satisfies Item[]

export const GiftsTier2 = [
  Item.GEMS_BUNDLE,
  Item.POTION,
  Item.FORAGE_BAG,
  Item.PRETTY_BOX,
  Item.COLLECTION_BOX,
  Item.LARGE_EXP_GIFT,
  Item.UNCOMMON_GIFT,
  Item.RARE_GIFT
] satisfies Item[]

export const GiftsTier3 = [
  Item.COMMON_GIFT,
  Item.EPIC_GIFT,
  Item.ULTRA_GIFT,
  Item.UNIQUE_GIFT,
  Item.LEGENDARY_GIFT,
  Item.STAR_GIFT,
  Item.TOOLBOX,
  Item.DELUXE_BOX
] satisfies Item[]

export const Gifts = [...GiftsTier1, ...GiftsTier2, ...GiftsTier3] as const
export type Gift = (typeof Gifts)[number]

export const GiftShopPrices: { [key in Gift]: number } = {
  [Item.BERRIES_GIFT]: 0,
  [Item.SWEETS_GIFT]: 0,
  [Item.DITTO_GIFT]: 0,
  [Item.TICKET_BUNDLE]: 0,
  [Item.HATCH_BUNDLE]: 0,
  [Item.REGIONAL_TOUR]: 0,
  [Item.BANQUET]: 0,
  [Item.SMALL_EXP_GIFT]: 0,

  [Item.POTION]: 5,
  [Item.GEMS_BUNDLE]: 5,
  [Item.LARGE_EXP_GIFT]: 10,
  [Item.FORAGE_BAG]: 15,
  [Item.STAR_GIFT]: 15,
  [Item.PRETTY_BOX]: 15,
  [Item.COLLECTION_BOX]: 20,
  [Item.DELUXE_BOX]: 40,
  [Item.TOOLBOX]: 20,
  [Item.COMMON_GIFT]: 15,
  [Item.UNCOMMON_GIFT]: 8,
  [Item.RARE_GIFT]: 10,
  [Item.EPIC_GIFT]: 15,
  [Item.ULTRA_GIFT]: 10,
  [Item.UNIQUE_GIFT]: 15,
  [Item.LEGENDARY_GIFT]: 40
}
