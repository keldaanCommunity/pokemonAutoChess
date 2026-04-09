import { t } from "i18next"
import { getBaseAltForm, RegionDetails, SynergyTriggers } from "../config"
import { precomputedPokemons } from "../models/precomputed/precomputed-pokemons"
import {
  CraftableItemsNoScarves,
  Item,
  ShinyItems,
  SynergyItemsNoSpecial,
  SynergyStones
} from "../types"
import { DungeonPMDO } from "../types/enum/Dungeon"
import {
  BattleMissionData,
  BattleMissionStat,
  BattleMissionStats,
  DeliveryMissionData,
  Expedition,
  ExpeditionData,
  ExpeditionRank,
  ExpeditionType,
  ExplorationMissionData,
  RescueMissionData
} from "../types/enum/Expedition"
import { Rarity } from "../types/enum/Game"
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
  if (level < 3) {
    return ExpeditionRank.E
  } else if (level < 6) {
    return ExpeditionRank.D
  } else if (level < 10) {
    return ExpeditionRank.C
  } else if (level < 15) {
    return ExpeditionRank.B
  } else if (level < 20) {
    return ExpeditionRank.A
  } else {
    return ExpeditionRank.S
  }
}

export function getExpeditionLabel(expedition: Expedition): string {
  if (expedition.type === ExpeditionType.BATTLE) {
    const data = getExpeditionData(expedition) as BattleMissionData
    if (data.stat === "maxWinStreak") {
      return t(`expeditions.BATTLE_WIN_STREAK_DESCRIPTION`, data)
    } else {
      const gameStatLabelMapping: Record<BattleMissionStat, string> = {
        maxHP: "HP",
        maxAttack: "ATK",
        maxDefense: "DEF",
        maxAP: "AP",
        maxSpecialDefense: "SPE_DEF",
        maxSpeed: "SPEED",
        maxPhysicalDamage: t(`game_stats.physical_damage_dealt`),
        maxSpecialDamage: t(`game_stats.special_damage_dealt`),
        maxTrueDamage: t(`game_stats.true_damage_dealt`),
        maxShield: t(`game_stats.shield_given`),
        maxHeal: t(`game_stats.hp_healed`),
        maxWinStreak: t(`streak`)
      }
      return t(`expeditions.BATTLE_DESCRIPTION`, {
        ...data,
        gameStat: gameStatLabelMapping[data.stat] || data.stat
      })
    }
  }

  if (expedition.type === ExpeditionType.EXPLORATION) {
    const data = getExpeditionData(expedition) as ExplorationMissionData
    return t(`expeditions.EXPLORATION_DESCRIPTION`, {
      ...data,
      regionSynergies: RegionDetails[data.region].synergies.join(" ")
    })
  }

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
  expedition: Expedition & { type: ExpeditionType.EXPLORATION }
): ExplorationMissionData
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
  | ExplorationMissionData
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
      const pokemonsOfCategory = precomputedPokemons
        .filter(
          (p) =>
            p.stars === (expedition.rank === "E" ? 2 : 3) && p.rarity === rarity
        )
        .filter(
          (p, index, arr) =>
            arr.findIndex(
              (p2) => getBaseAltForm(p2.name) === getBaseAltForm(p.name)
            ) === index
        ) // get only base alt forms
      // console.log({ pokemonsOfCategory: pokemonsOfCategory.map((p) => p.name) })
      const pokemonToRescue =
        pokemonsOfCategory[expedition.hash % pokemonsOfCategory.length].name
      return { pokemon: pokemonToRescue }
    }

    case ExpeditionType.EXPLORATION: {
      const regions = Object.values(DungeonPMDO)
      const region = regions[expedition.hash % regions.length]
      const regionSynergies = RegionDetails[region].synergies
      const synergy = regionSynergies[expedition.hash % regionSynergies.length]
      const synergyTriggers = SynergyTriggers[synergy]
      const level = synergyTriggers[max(synergyTriggers.length - 1)(rankIndex)]
      return {
        region,
        synergy,
        level
      }
    }

    case ExpeditionType.BATTLE: {
      const stat =
        BattleMissionStats[expedition.hash % BattleMissionStats.length]
      const AMOUNTS_BY_RANK: Record<
        ExpeditionRank,
        Record<BattleMissionStat, number>
      > = {
        E: {
          maxAttack: 50,
          maxDefense: 50,
          maxSpecialDefense: 50,
          maxSpeed: 150,
          maxHP: 400,
          maxAP: 200,
          maxPhysicalDamage: 500,
          maxSpecialDamage: 500,
          maxTrueDamage: 250,
          maxShield: 250,
          maxHeal: 250,
          maxWinStreak: 5
        },
        D: {
          maxAttack: 60,
          maxDefense: 60,
          maxSpecialDefense: 60,
          maxSpeed: 180,
          maxHP: 500,
          maxAP: 250,
          maxPhysicalDamage: 600,
          maxSpecialDamage: 600,
          maxTrueDamage: 300,
          maxShield: 300,
          maxHeal: 300,
          maxWinStreak: 6
        },
        C: {
          maxAttack: 80,
          maxDefense: 80,
          maxSpecialDefense: 80,
          maxSpeed: 210,
          maxHP: 750,
          maxAP: 300,
          maxPhysicalDamage: 750,
          maxSpecialDamage: 750,
          maxTrueDamage: 400,
          maxShield: 400,
          maxHeal: 400,
          maxWinStreak: 7
        },
        B: {
          maxAttack: 100,
          maxDefense: 100,
          maxSpecialDefense: 100,
          maxSpeed: 240,
          maxHP: 1000,
          maxAP: 350,
          maxPhysicalDamage: 1000,
          maxSpecialDamage: 1000,
          maxTrueDamage: 500,
          maxShield: 500,
          maxHeal: 500,
          maxWinStreak: 8
        },
        A: {
          maxAttack: 150,
          maxDefense: 150,
          maxSpecialDefense: 150,
          maxSpeed: 270,
          maxHP: 1250,
          maxAP: 400,
          maxPhysicalDamage: 1500,
          maxSpecialDamage: 1500,
          maxTrueDamage: 750,
          maxShield: 750,
          maxHeal: 750,
          maxWinStreak: 9
        },
        S: {
          maxAttack: 200,
          maxDefense: 200,
          maxSpecialDefense: 200,
          maxSpeed: 300,
          maxHP: 1500,
          maxAP: 450,
          maxPhysicalDamage: 2000,
          maxSpecialDamage: 2000,
          maxTrueDamage: 1000,
          maxShield: 1000,
          maxHeal: 1000,
          maxWinStreak: 10
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
        [ExpeditionRank.B]: [
          Item.AMULET_COIN,
          Item.GIMMIGHOUL_COIN,
          Item.LEADERS_CREST,
          Item.DRAGON_GEM,
          Item.SUN_STONE
        ],
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
