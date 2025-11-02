import { Emotion } from "../types"
import { Stat } from "../types/enum/Game"
import {
  CraftableItems,
  CraftableNonSynergyItems,
  Item,
  ItemComponents,
  NonSpecialItemComponents,
  ShinyItems
} from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { chance, pickNRandomIn, pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"
import Player from "./colyseus-models/player"

export type PVEStage = {
  name: string
  avatar: Pkm
  emotion?: Emotion
  shinyChance?: number
  rewards?: Item[]
  getRewards?: (player: Player) => Item[]
  getRewardsPropositions?: (player: Player) => Item[]
  board: [pkm: Pkm, x: number, y: number][]
  marowakItems?: Item[][]
  statBoosts?: { [stat in Stat]?: number }
}

export const PVEStages: { [turn: number]: PVEStage } = {
  1: {
    name: "pkm.MAGIKARP",
    avatar: Pkm.MAGIKARP,
    board: [
      [Pkm.MAGIKARP, 3, 1],
      [Pkm.MAGIKARP, 5, 1]
    ],
    shinyChance: 1 / 40,
    rewards: NonSpecialItemComponents,
    getRewards(player: Player) {
      const randomComponent = pickRandomIn(NonSpecialItemComponents)
      player.randomComponentsGiven.push(randomComponent)
      return [randomComponent]
    }
  },

  2: {
    name: "pkm.RATTATA",
    avatar: Pkm.RATTATA,
    board: [
      [Pkm.RATTATA, 3, 1],
      [Pkm.RATTATA, 5, 1]
    ],
    rewards: NonSpecialItemComponents,
    getRewards(player) {
      const randomComponent = pickRandomIn(
        NonSpecialItemComponents.filter(
          (i) => player.randomComponentsGiven.includes(i) === false
        )
      )
      player.randomComponentsGiven.push(randomComponent)
      return [randomComponent]
    }
  },

  3: {
    name: "pkm.SPEAROW",
    avatar: Pkm.SPEAROW,
    board: [
      [Pkm.SPEAROW, 3, 1],
      [Pkm.SPEAROW, 5, 1],
      [Pkm.SPEAROW, 4, 2]
    ],
    rewards: NonSpecialItemComponents,
    getRewards(player) {
      const randomComponent = pickRandomIn(
        NonSpecialItemComponents.filter(
          (i) => player.randomComponentsGiven.includes(i) === false
        )
      )
      player.randomComponentsGiven.push(randomComponent)
      return [randomComponent]
    }
  },

  9: {
    name: "pkm.GYARADOS",
    avatar: Pkm.GYARADOS,
    board: [[Pkm.GYARADOS, 4, 2]],
    marowakItems: [[Item.KINGS_ROCK]],
    shinyChance: 1 / 100,
    rewards: ItemComponents,
    getRewards(player: Player) {
      const randomComponents = pickNRandomIn(ItemComponents, 1)
      return randomComponents
    }
  },

  14: {
    name: "pkm.MEWTWO",
    avatar: Pkm.MEWTWO,
    emotion: Emotion.DETERMINED,
    board: [
      [Pkm.MEWTWO, 0, 1],
      [Pkm.MEW, 7, 1]
    ],
    marowakItems: [
      [Item.METAL_COAT, Item.LIGHT_BALL],
      [Item.WIDE_LENS, Item.DEEP_SEA_TOOTH]
    ],
    rewards: NonSpecialItemComponents,
    getRewards(player: Player) {
      const rewards = [pickRandomIn(NonSpecialItemComponents)]
      if (values(player.board).some((p) => p.name === Pkm.CHARCADET)) {
        const psyLevel = player.synergies.get(Synergy.PSYCHIC) || 0
        const ghostLevel = player.synergies.get(Synergy.GHOST) || 0
        const armorReceived =
          psyLevel > ghostLevel
            ? Item.AUSPICIOUS_ARMOR
            : psyLevel < ghostLevel
              ? Item.MALICIOUS_ARMOR
              : chance(1 / 2)
                ? Item.AUSPICIOUS_ARMOR
                : Item.MALICIOUS_ARMOR
        rewards.push(armorReceived)
      }
      return rewards
    }
  },

  19: {
    name: "tower_duo",
    avatar: Pkm.LUGIA,
    emotion: Emotion.DETERMINED,
    board: [
      [Pkm.LUGIA, 3, 1],
      [Pkm.HO_OH, 5, 1]
    ],
    statBoosts: {
      [Stat.HP]: 50,
      [Stat.DEF]: 5,
      [Stat.SPE_DEF]: 5
    },
    marowakItems: [[Item.COMET_SHARD], [Item.SACRED_ASH]],
    shinyChance: 1 / 100,
    rewards: [...NonSpecialItemComponents, ...CraftableNonSynergyItems],
    getRewards(player: Player) {
      const items = values(player.board)
        .flatMap((p) => values(p.items))
        .concat(values(player.items))
      const nbComponents = items.filter((i) =>
        ItemComponents.includes(i)
      ).length
      if (nbComponents % 2 === 1) {
        // ensure we dont stay with a single useless component
        return [pickRandomIn(NonSpecialItemComponents)]
      } else {
        return [pickRandomIn(CraftableNonSynergyItems)]
      }
    }
  },

  24: {
    name: "legendary_birds",
    avatar: Pkm.ZAPDOS,
    board: [
      [Pkm.ZAPDOS, 2, 2],
      [Pkm.MOLTRES, 4, 2],
      [Pkm.ARTICUNO, 6, 2]
    ],
    statBoosts: {
      [Stat.HP]: 100,
      [Stat.DEF]: 10,
      [Stat.SPE_DEF]: 10,
      [Stat.AP]: 50
    },
    marowakItems: [
      [Item.AQUA_EGG, Item.SOUL_DEW, Item.XRAY_VISION],
      [Item.AQUA_EGG, Item.SOUL_DEW, Item.POKEMONOMICON],
      [Item.AQUA_EGG, Item.SOUL_DEW, Item.STAR_DUST]
    ],
    rewards: CraftableItems,
    getRewards(player: Player) {
      for (const p of values(player.board)) {
        if (p.name === Pkm.ZACIAN) {
          return [Item.RUSTED_SWORD]
        }
      }
      return []
    },
    getRewardsPropositions(player: Player) {
      const rewards = pickNRandomIn(CraftableNonSynergyItems, 2)
      rewards.push(
        pickRandomIn(CraftableItems.filter((o) => !rewards.includes(o)))
      )
      return rewards
    }
  },

  28: {
    name: "legendary_beasts",
    avatar: Pkm.SUICUNE,
    emotion: Emotion.DETERMINED,
    board: [
      [Pkm.ENTEI, 2, 2],
      [Pkm.RAIKOU, 4, 2],
      [Pkm.SUICUNE, 6, 2]
    ],
    statBoosts: {
      [Stat.HP]: 100,
      [Stat.DEF]: 10,
      [Stat.SPE_DEF]: 10,
      [Stat.ATK]: 10,
      [Stat.SPEED]: 10,
      [Stat.PP]: 80,
      [Stat.AP]: 50
    },
    marowakItems: [
      [Item.ICE_STONE, Item.THUNDER_STONE, Item.SHELL_BELL],
      [Item.FIRE_STONE, Item.ICE_STONE, Item.SHELL_BELL],
      [Item.FIRE_STONE, Item.THUNDER_STONE, Item.SHELL_BELL]
    ],
    rewards: CraftableItems,
    getRewardsPropositions(player: Player) {
      const rewards = pickNRandomIn(CraftableNonSynergyItems, 2)
      rewards.push(
        pickRandomIn(CraftableItems.filter((o) => !rewards.includes(o)))
      )
      return rewards
    }
  },

  32: {
    name: "super_ancients",
    avatar: Pkm.RAYQUAZA,
    emotion: Emotion.DETERMINED,
    board: [
      [Pkm.PRIMAL_KYOGRE, 2, 2],
      [Pkm.MEGA_RAYQUAZA, 4, 2],
      [Pkm.PRIMAL_GROUDON, 6, 2]
    ],
    statBoosts: {
      [Stat.HP]: 200,
      [Stat.DEF]: 15,
      [Stat.SPE_DEF]: 15,
      [Stat.ATK]: 10
    },
    marowakItems: [
      [Item.BLUE_ORB, Item.AQUA_EGG, Item.SOUL_DEW],
      [Item.GREEN_ORB, Item.STAR_DUST, Item.POWER_LENS],
      [Item.RED_ORB, Item.FLAME_ORB, Item.PROTECTIVE_PADS]
    ],
    rewards: CraftableItems,
    getRewardsPropositions(player: Player) {
      const rewards = pickNRandomIn(CraftableNonSynergyItems, 2)
      rewards.push(
        pickRandomIn(CraftableItems.filter((o) => !rewards.includes(o)))
      )
      return rewards
    }
  },

  36: {
    name: "legendary_giants",
    avatar: Pkm.REGICE,
    emotion: Emotion.DETERMINED,
    board: [
      [Pkm.REGIELEKI, 1, 3],
      [Pkm.REGICE, 2, 3],
      [Pkm.REGIGIGAS, 3, 3],
      [Pkm.REGIROCK, 4, 3],
      [Pkm.REGISTEEL, 5, 3],
      [Pkm.REGIDRAGO, 6, 3]
    ],
    statBoosts: {
      [Stat.HP]: 50
    },
    marowakItems: [
      [],
      [Item.ABILITY_SHIELD, Item.GRACIDEA_FLOWER, Item.GREEN_ORB],
      [Item.DYNAMAX_BAND],
      [Item.ABILITY_SHIELD, Item.GRACIDEA_FLOWER, Item.GREEN_ORB],
      [Item.ABILITY_SHIELD, Item.GRACIDEA_FLOWER, Item.GREEN_ORB],
      []
    ],
    rewards: CraftableItems,
    getRewardsPropositions(player: Player) {
      const rewards = pickNRandomIn(CraftableNonSynergyItems, 2)
      rewards.push(
        pickRandomIn(CraftableItems.filter((o) => !rewards.includes(o)))
      )
      return rewards
    }
  },

  40: {
    name: "pkm.ARCEUS",
    avatar: Pkm.ARCEUS,
    emotion: Emotion.INSPIRED,
    board: [
      [Pkm.DIALGA, 2, 3],
      [Pkm.GIRATINA, 4, 3],
      [Pkm.PALKIA, 6, 3],
      [Pkm.ARCEUS, 4, 1]
    ],
    statBoosts: {
      [Stat.HP]: 200,
      [Stat.DEF]: 15,
      [Stat.SPE_DEF]: 15,
      [Stat.ATK]: 10,
      [Stat.AP]: 50
    },
    marowakItems: [
      [Item.DYNAMAX_BAND],
      [Item.DYNAMAX_BAND],
      [Item.DYNAMAX_BAND],
      [Item.DYNAMAX_BAND]
    ],
    rewards: ShinyItems,
    getRewardsPropositions(player: Player) {
      return pickNRandomIn(ShinyItems, 3)
    }
  }
}
