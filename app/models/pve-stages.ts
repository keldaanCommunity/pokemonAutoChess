import { Emotion } from "../types"
import {
  ItemComponents,
  CraftableItems,
  Item,
  NonSpecialItemComponents,
  ShinyItems,
  CraftableNonSynergyItems
} from "../types/enum/Item"
import { Pkm } from "../types/enum/Pokemon"
import { pickNRandomIn, pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"
import Player from "./colyseus-models/player"

export type PVEStage = {
  name: string
  avatar: Pkm
  emotion?: Emotion
  shinyChance?: number
  getRewards?: (player: Player) => Item[]
  getRewardsPropositions?: (player: Player) => Item[]
  board: [pkm: Pkm, x: number, y: number][]
  marowakItems?: Item[][]
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
    shinyChance: 1 / 40,
    board: [[Pkm.GYARADOS, 4, 2]],
    marowakItems: [[Item.KINGS_ROCK]],
    getRewards(player: Player) {
      const randomComponents = pickNRandomIn(ItemComponents, 1)
      return randomComponents
    }
  },

  14: {
    name: "pkm.MEWTWO",
    avatar: Pkm.MEWTWO,
    emotion: Emotion.DETERMINED,
    shinyChance: 0, // can't propose shiny items because item proposition on stage 15
    board: [
      [Pkm.MEWTWO, 0, 1],
      [Pkm.MEW, 7, 1]
    ],
    marowakItems: [
      [Item.METAL_COAT, Item.LIGHT_BALL],
      [Item.WIDE_LENS, Item.MANA_SCARF]
    ],
    getRewards(player: Player) {
      return [pickRandomIn(NonSpecialItemComponents)]
    }
  },

  19: {
    name: "tower_duo",
    avatar: Pkm.LUGIA,
    emotion: Emotion.DETERMINED,
    shinyChance: 1 / 40,
    board: [
      [Pkm.LUGIA, 3, 1],
      [Pkm.HO_OH, 5, 1]
    ],
    marowakItems: [[Item.COMET_SHARD], [Item.SACRED_ASH]],
    getRewards(player: Player) {
      const items = values(player.board)
        .flatMap((p) => values(p.items))
        .concat([...player.items])
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
    marowakItems: [[Item.FLUFFY_TAIL], [Item.POKEMONOMICON], [Item.AQUA_EGG]],
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
    marowakItems: [
      [Item.ICE_STONE, Item.THUNDER_STONE, Item.SHELL_BELL],
      [Item.FIRE_STONE, Item.ICE_STONE, Item.SHELL_BELL],
      [Item.FIRE_STONE, Item.THUNDER_STONE, Item.SHELL_BELL]
    ],
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
    marowakItems: [
      [Item.BLUE_ORB, Item.AQUA_EGG, Item.SOUL_DEW],
      [Item.GREEN_ORB, Item.STAR_DUST, Item.POWER_LENS],
      [Item.RED_ORB, Item.FLAME_ORB, Item.PROTECTIVE_PADS]
    ],
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
      [Pkm.REGIELEKI, 2, 2],
      [Pkm.REGICE, 2, 3],
      [Pkm.REGIGIGAS, 3, 3],
      [Pkm.REGIROCK, 4, 3],
      [Pkm.REGISTEEL, 5, 3],
      [Pkm.REGIDRAGO, 5, 2]
    ],
    marowakItems: [
      [Item.OLD_AMBER],
      [Item.OLD_AMBER],
      [Item.OLD_AMBER],
      [Item.OLD_AMBER],
      [Item.OLD_AMBER],
      [Item.OLD_AMBER]
    ],
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
    marowakItems: [
      [Item.DYNAMAX_BAND],
      [Item.DYNAMAX_BAND],
      [Item.DYNAMAX_BAND],
      [Item.DYNAMAX_BAND]
    ],
    getRewardsPropositions(player: Player) {
      return pickNRandomIn(ShinyItems, 3)
    }
  }
}
