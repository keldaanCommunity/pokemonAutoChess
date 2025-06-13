import { SetSchema } from "@colyseus/schema"
import { CraftableItems, Item, SynergyStones } from "../types/enum/Item"
import { pickRandomIn } from "../utils/random"
import { Stat } from "../types/enum/Game"

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

export const ItemStats: { [item in Item]?: { [stat in Stat]?: number } } = {
  [Item.TWISTED_SPOON]: { [Stat.AP]: 10 },
  [Item.MAGNET]: { [Stat.SPEED]: 10 },
  [Item.BLACK_GLASSES]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.MIRACLE_SEED]: { [Stat.SHIELD]: 15 },
  [Item.CHARCOAL]: { [Stat.ATK]: 3 },
  [Item.NEVER_MELT_ICE]: { [Stat.SPE_DEF]: 3 },
  [Item.HEART_SCALE]: { [Stat.DEF]: 3 },
  [Item.MYSTIC_WATER]: { [Stat.PP]: 15 },
  [Item.OLD_AMBER]: {},
  [Item.DAWN_STONE]: { [Stat.AP]: 10 },
  [Item.WATER_STONE]: { [Stat.PP]: 15 },
  [Item.THUNDER_STONE]: { [Stat.SPEED]: 10 },
  [Item.FIRE_STONE]: { [Stat.ATK]: 3 },
  [Item.MOON_STONE]: { [Stat.DEF]: 3 },
  [Item.DUSK_STONE]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.LEAF_STONE]: { [Stat.SHIELD]: 15 },
  [Item.ICE_STONE]: { [Stat.SPE_DEF]: 3 },
  [Item.CHOICE_SPECS]: { [Stat.AP]: 100 },
  [Item.SOUL_DEW]: { [Stat.AP]: 10, [Stat.PP]: 15 },
  [Item.UPGRADE]: { [Stat.AP]: 10, [Stat.SPEED]: 10 },
  [Item.REAPER_CLOTH]: { [Stat.AP]: 10, [Stat.CRIT_CHANCE]: 20 },
  [Item.POKEMONOMICON]: { [Stat.AP]: 10, [Stat.SHIELD]: 15 },
  [Item.POWER_LENS]: { [Stat.AP]: 10, [Stat.SPE_DEF]: 10 },
  [Item.SHELL_BELL]: { [Stat.AP]: 10, [Stat.ATK]: 3 },
  [Item.LUCKY_EGG]: { [Stat.AP]: 60, [Stat.DEF]: 12, [Stat.LUCK]: 50 },
  [Item.AQUA_EGG]: { [Stat.PP]: 50 },
  [Item.BLUE_ORB]: { [Stat.PP]: 15, [Stat.SPEED]: 10 },
  [Item.SCOPE_LENS]: { [Stat.PP]: 15, [Stat.CRIT_CHANCE]: 25 },
  [Item.STAR_DUST]: { [Stat.PP]: 15, [Stat.SHIELD]: 15 },
  [Item.GREEN_ORB]: { [Stat.PP]: 15, [Stat.SPE_DEF]: 3 },
  [Item.MANA_SCARF]: { [Stat.PP]: 15, [Stat.ATK]: 3 },
  [Item.SMOKE_BALL]: { [Stat.PP]: 15, [Stat.DEF]: 3 },
  [Item.XRAY_VISION]: { [Stat.SPEED]: 50 },
  [Item.RAZOR_FANG]: {
    [Stat.SPEED]: 10,
    [Stat.CRIT_CHANCE]: 10,
    [Stat.CRIT_POWER]: 100
  },
  [Item.GRACIDEA_FLOWER]: { [Stat.SPEED]: 10, [Stat.SHIELD]: 15 },
  [Item.CHOICE_SCARF]: { [Stat.SPEED]: 10, [Stat.SPE_DEF]: 3 },
  [Item.PUNCHING_GLOVE]: { [Stat.SPEED]: 10, [Stat.ATK]: 3 },
  [Item.MUSCLE_BAND]: { [Stat.SPEED]: 10, [Stat.DEF]: 3 },
  [Item.WONDER_BOX]: { [Stat.CRIT_CHANCE]: 10 },
  [Item.CLEANSE_TAG]: { [Stat.CRIT_CHANCE]: 10, [Stat.SHIELD]: 15 },
  [Item.WIDE_LENS]: { [Stat.CRIT_CHANCE]: 10, [Stat.SPE_DEF]: 3 },
  [Item.RAZOR_CLAW]: { [Stat.CRIT_CHANCE]: 50, [Stat.ATK]: 3 },
  [Item.FLUFFY_TAIL]: { [Stat.CRIT_CHANCE]: 10, [Stat.DEF]: 3 },
  [Item.KINGS_ROCK]: { [Stat.SHIELD]: 100 },
  [Item.SHINY_CHARM]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 3 },
  [Item.PROTECTIVE_PADS]: { [Stat.SHIELD]: 60, [Stat.ATK]: 6 },
  [Item.MAX_REVIVE]: { [Stat.SHIELD]: 15, [Stat.DEF]: 3 },
  [Item.ASSAULT_VEST]: { [Stat.SPE_DEF]: 40 },
  [Item.AMULET_COIN]: {},
  [Item.POKE_DOLL]: { [Stat.DEF]: 3, [Stat.SPE_DEF]: 3 },
  [Item.RED_ORB]: { [Stat.ATK]: 10 },
  [Item.FLAME_ORB]: { [Stat.ATK]: 5, [Stat.DEF]: 3 },
  [Item.ROCKY_HELMET]: { [Stat.DEF]: 25 },
  [Item.ELECTIRIZER]: { [Stat.SPEED]: 30 },
  [Item.MAGMARIZER]: { [Stat.ATK]: 5 },
  [Item.MACHO_BRACE]: { [Stat.ATK]: 15, [Stat.SPEED]: -15 },
  [Item.LIGHT_BALL]: { [Stat.AP]: 75 },
  [Item.TOXIC_ORB]: { [Stat.SHIELD]: 15, [Stat.SPE_DEF]: 4 },
  [Item.METRONOME]: { [Stat.PP]: 5 },
  [Item.METAL_COAT]: { [Stat.DEF]: 10, [Stat.SPE_DEF]: 10 },
  [Item.SWIFT_WING]: { [Stat.SPEED]: 30 },
  [Item.HARD_STONE]: { [Stat.SHIELD]: 100 },
  [Item.BIG_NUGGET]: {
    [Stat.DEF]: 10,
    [Stat.SPE_DEF]: 10
  },
  [Item.INCENSE]: { [Stat.SPE_DEF]: 10, [Stat.AP]: 30 },
  [Item.COOKING_POT]: { [Stat.DEF]: 10 },
  [Item.EVIOLITE]: {
    [Stat.HP]: 100,
    [Stat.ATK]: 10,
    [Stat.AP]: 50,
    [Stat.DEF]: 10,
    [Stat.SPE_DEF]: 10
  },
  [Item.GOLD_BOTTLE_CAP]: {
    [Stat.CRIT_CHANCE]: 50,
    [Stat.LUCK]: 50
  },
  [Item.COMET_SHARD]: { [Stat.ATK]: 15 },
  [Item.ABSORB_BULB]: { [Stat.DEF]: 20, [Stat.SPE_DEF]: 20 },
  [Item.GOLD_BOW]: { [Stat.SHIELD]: 50 },
  [Item.TEAL_MASK]: { [Stat.SHIELD]: 50 },
  [Item.WELLSPRING_MASK]: { [Stat.SHIELD]: 50 },
  [Item.CORNERSTONE_MASK]: { [Stat.SHIELD]: 50 },
  [Item.HEARTHFLAME_MASK]: { [Stat.SHIELD]: 50 }
}
