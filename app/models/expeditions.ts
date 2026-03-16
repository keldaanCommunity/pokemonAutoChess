import { t } from "i18next"
import { precomputedPokemons } from "../../gen/precomputed-pokemons"
import { RegionDetails, SynergyTriggers } from "../config"
import {
  CraftableItemsNoScarves,
  Item,
  ShinyItems,
  SynergyItemsNoSpecial,
  SynergyStones,
  TownItems
} from "../types"
import { DungeonPMDO } from "../types/enum/Dungeon"
import {
  BattleMissionData,
  DeliveryMissionData,
  Expedition,
  ExpeditionData,
  ExpeditionRank,
  ExpeditionType,
  RescueMissionData,
  SecretBaseMissionData
} from "../types/enum/Expedition"
import { Rarity, Stat } from "../types/enum/Game"
import {
  IUserMetadataClient,
  IUserMetadataMongo,
  IUserMetadataUnpacked
} from "../types/interfaces/UserMetadata"
import { max } from "../utils/number"

export function getPlayerExpeditions(
  user: IUserMetadataClient | IUserMetadataMongo | IUserMetadataUnpacked
): Expedition[] {
  // compute hash based on player UID and number of expeditions done
  // this is a placeholder implementation and should be replaced with actual logic

  const hash: number =
    user.uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) +
    user.eventPoints
  const expeditionsTypes = Object.values<ExpeditionType>(ExpeditionType)
  const expeditions: Expedition[] = [...expeditionsTypes, ...expeditionsTypes]
    .slice(hash % expeditionsTypes.length, (hash % expeditionsTypes.length) + 3)
    .map((type, i) => ({
      rank: getExpeditionTier(user.eventPoints - i),
      type,
      hash
    }))

  return expeditions
}

export function getExpeditionTier(level: number): ExpeditionRank {
  if (level < 5) {
    return ExpeditionRank.E
  } else if (level < 10) {
    return ExpeditionRank.D
  } else if (level < 15) {
    return ExpeditionRank.C
  } else if (level < 20) {
    return ExpeditionRank.B
  } else if (level < 30) {
    return ExpeditionRank.A
  } else {
    return ExpeditionRank.S
  }
}

export function checkExpeditionCompletion(
  user: IUserMetadataClient | IUserMetadataMongo | IUserMetadataUnpacked,
  expedition: Expedition
): boolean {
  // Placeholder logic for checking expedition completion
  // This should be replaced with actual logic based on the user's progress and the expedition's requirements
  return false
}

export function getExpeditionLabel(expedition: Expedition): string {
  return t(
    `expeditions.${expedition.type}_DESCRIPTION`,
    getExpeditionData(expedition)
  )
}

export function getExpeditionData(expedition: Expedition): ExpeditionData
export function getExpeditionData(
  expedition: Expedition & { type: ExpeditionType.RESCUE }
): RescueMissionData
export function getExpeditionData(
  expedition: Expedition & { type: ExpeditionType.SECRET_BASE }
): SecretBaseMissionData
export function getExpeditionData(
  expedition: Expedition & { type: ExpeditionType.BATTLE }
): BattleMissionData
export function getExpeditionData(
  expedition: Expedition & { type: ExpeditionType.DELIVERY }
): DeliveryMissionData
export function getExpeditionData(
  expedition: Expedition
):
  | RescueMissionData
  | SecretBaseMissionData
  | BattleMissionData
  | DeliveryMissionData {
  const rankIndex = ["E", "D", "C", "B", "A", "S"].indexOf(expedition.rank)
  switch (expedition.type) {
    case ExpeditionType.RESCUE: {
      const rarity = [
        Rarity.COMMON,
        Rarity.COMMON,
        Rarity.UNCOMMON,
        Rarity.RARE,
        Rarity.EPIC,
        Rarity.LEGENDARY
      ][rankIndex]
      const pokemonsOfCategory = precomputedPokemons.filter(
        (p) =>
          p.stars === (expedition.rank === "E" ? 2 : 3) && p.rarity === rarity
      )
      const pokemonToRescue =
        pokemonsOfCategory[expedition.hash % pokemonsOfCategory.length]
      return { pokemon: pokemonToRescue.name }
    }

    case ExpeditionType.SECRET_BASE: {
      const regions = Object.values(DungeonPMDO)
      const region = regions[expedition.hash % regions.length]
      const regionSynergies = RegionDetails[region].synergies
      const synergy = regionSynergies[expedition.hash % regionSynergies.length]
      const synergyTriggers = SynergyTriggers[synergy]
      const level = synergyTriggers[max(synergyTriggers.length - 1)(rankIndex)]
      return {
        region,
        regionSynergies: regionSynergies.join(" "),
        synergy,
        level
      }
    }

    case ExpeditionType.BATTLE: {
      const stats = [
        Stat.ATK,
        Stat.DEF,
        Stat.SPE_DEF,
        Stat.SPEED,
        Stat.HP
      ] satisfies Stat[]
      const stat = stats[expedition.hash % stats.length]
      const AMOUNTS_BY_RANK: Record<
        ExpeditionRank,
        Record<(typeof stats)[number], number>
      > = {
        E: {
          [Stat.ATK]: 40,
          [Stat.DEF]: 40,
          [Stat.SPE_DEF]: 40,
          [Stat.SPEED]: 150,
          [Stat.HP]: 400
        },
        D: {
          [Stat.ATK]: 50,
          [Stat.DEF]: 50,
          [Stat.SPE_DEF]: 50,
          [Stat.SPEED]: 180,
          [Stat.HP]: 500
        },
        C: {
          [Stat.ATK]: 60,
          [Stat.DEF]: 60,
          [Stat.SPE_DEF]: 60,
          [Stat.SPEED]: 210,
          [Stat.HP]: 750
        },
        B: {
          [Stat.ATK]: 70,
          [Stat.DEF]: 70,
          [Stat.SPE_DEF]: 70,
          [Stat.SPEED]: 240,
          [Stat.HP]: 1000
        },
        A: {
          [Stat.ATK]: 80,
          [Stat.DEF]: 80,
          [Stat.SPE_DEF]: 80,
          [Stat.SPEED]: 270,
          [Stat.HP]: 1250
        },
        S: {
          [Stat.ATK]: 100,
          [Stat.DEF]: 100,
          [Stat.SPE_DEF]: 100,
          [Stat.SPEED]: 300,
          [Stat.HP]: 1500
        }
      }
      const amount = AMOUNTS_BY_RANK[expedition.rank][stat]
      return {
        stat,
        amount
      }
    }

    case ExpeditionType.DELIVERY: {
      const itemTypePerRank: Record<ExpeditionRank, Item[]> = {
        [ExpeditionRank.E]: CraftableItemsNoScarves,
        [ExpeditionRank.D]: CraftableItemsNoScarves,
        [ExpeditionRank.C]: SynergyItemsNoSpecial,
        [ExpeditionRank.B]: TownItems,
        [ExpeditionRank.A]: SynergyStones,
        [ExpeditionRank.S]: ShinyItems
      }
      const quantityPerRank: Record<ExpeditionRank, number> = {
        [ExpeditionRank.E]: 1,
        [ExpeditionRank.D]: 2,
        [ExpeditionRank.C]: 1,
        [ExpeditionRank.B]: 1,
        [ExpeditionRank.A]: 2,
        [ExpeditionRank.S]: 1
      }
      const items = itemTypePerRank[expedition.rank]
      const item = items[expedition.hash % items.length]
      const quantity = quantityPerRank[expedition.rank]
      return {
        item,
        quantity
      }
    }

    default:
      throw new Error(`Unhandled expedition type: ${expedition.type}`)
  }
}
