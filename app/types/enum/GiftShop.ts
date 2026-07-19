import { Item } from "./Item"

export const FreeGifts = [
  Item.BERRIES_GIFT,
  Item.SWEETS_GIFT,
  Item.DITTO_GIFT,
  Item.TICKET_BUNDLE,
  Item.HATCH_BUNDLE,
  Item.REGIONAL_TOUR,
  Item.BANQUET
] as const

export const PaidGifts = [
  Item.GEMS_BUNDLE,
  Item.POTION,
  Item.DELUXE_BOX,
  Item.TOOLBOX,
  Item.EXP_GIFT,
  Item.STAR_GIFT,
  Item.COMMON_GIFT,
  Item.UNCOMMON_GIFT,
  Item.RARE_GIFT,
  Item.EPIC_GIFT,
  Item.ULTRA_GIFT,
  Item.UNIQUE_GIFT,
  Item.LEGENDARY_GIFT
] as const

export const Gifts = [...FreeGifts, ...PaidGifts]

export type FreeGift = (typeof FreeGifts)[number]
export type PaidGift = (typeof PaidGifts)[number]

export const GiftShopPrices: { [key in Gift]: number } = {
  [Item.BERRIES_GIFT]: 0,
  [Item.SWEETS_GIFT]: 0,
  [Item.DITTO_GIFT]: 0,
  [Item.TICKET_BUNDLE]: 0,
  [Item.HATCH_BUNDLE]: 0,
  [Item.REGIONAL_TOUR]: 0,
  [Item.BANQUET]: 0,

  [Item.POTION]: 5,
  [Item.GEMS_BUNDLE]: 5,
  [Item.EXP_GIFT]: 10,
  [Item.STAR_GIFT]: 15,
  [Item.DELUXE_BOX]: 15,
  [Item.TOOLBOX]: 20,
  [Item.COMMON_GIFT]: 15,
  [Item.UNCOMMON_GIFT]: 6,
  [Item.RARE_GIFT]: 9,
  [Item.EPIC_GIFT]: 12,
  [Item.ULTRA_GIFT]: 5,
  [Item.UNIQUE_GIFT]: 15,
  [Item.LEGENDARY_GIFT]: 40
}

export type Gift = FreeGift | PaidGift
