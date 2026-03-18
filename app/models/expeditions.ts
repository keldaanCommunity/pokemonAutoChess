import { t } from "i18next"
import { precomputedPokemons } from "../../gen/precomputed-pokemons"
import { RegionDetails, SynergyTriggers } from "../config"
import { ExpPerExpeditionRank } from "../config/game/expeditions"
import { giveUserExp } from "../core/collection"
import { notificationsService } from "../services/notifications"
import {
  CraftableItemsNoScarves,
  IPlayer,
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
  ExplorationMissionData,
  RescueMissionData
} from "../types/enum/Expedition"
import { Rarity } from "../types/enum/Game"
import { BattleStat, BattleStatsList } from "../types/interfaces/BattleStats"
import {
  IUserMetadataClient,
  IUserMetadataMongo,
  IUserMetadataUnpacked
} from "../types/interfaces/UserMetadata"
import { max } from "../utils/number"
import { values } from "../utils/schemas"

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

export function updatePlayerExpeditionsAfterGame(
  player: IPlayer,
  usr: IUserMetadataMongo
) {
  getPlayerExpeditions(usr).forEach((expedition) => {
    if (checkExpeditionCompletion(player, expedition)) {
      // mark expedition as completed in the database
      usr.eventPoints++
      usr.maxEventPoints = Math.max(usr.maxEventPoints, usr.eventPoints)
      const points = ExpPerExpeditionRank[expedition.rank]
      notificationsService.addNotification(
        player.id,
        "expedition_completed",
        `${expedition.type}|${expedition.rank}|${points}`
      )
      giveUserExp(usr, points)
    }
  })
}

export function checkExpeditionCompletion(
  player: IPlayer,
  expedition: Expedition
): boolean {
  switch (expedition.type) {
    case ExpeditionType.RESCUE: {
      const expeditionData = getExpeditionData(expedition) as RescueMissionData
      return values(player.board).some((p) => p.name === expeditionData.pokemon)
    }

    case ExpeditionType.EXPLORATION: {
      const expeditionData = getExpeditionData(
        expedition
      ) as ExplorationMissionData
      return (
        player.regions.includes(expeditionData.region) &&
        (player.synergies.get(expeditionData.synergy) ?? 0) >=
          expeditionData.level
      )
    }

    case ExpeditionType.BATTLE: {
      const expeditionData = getExpeditionData(expedition) as BattleMissionData
      return (
        (player.battleStats[expeditionData.stat] ?? 0) >= expeditionData.amount
      )
    }

    case ExpeditionType.DELIVERY: {
      const expeditionData = getExpeditionData(
        expedition
      ) as DeliveryMissionData
      const items = [
        ...player.items,
        ...values(player.board).flatMap((p) => p.items)
      ]
      return (
        items.filter((item) => item === expeditionData.item).length >=
        expeditionData.quantity
      )
    }

    default:
      return false
  }
}

export function getExpeditionLabel(expedition: Expedition): string {
  if (expedition.type === ExpeditionType.BATTLE) {
    const data = getExpeditionData(expedition) as BattleMissionData
    if (data.stat === "maxVictoryStreak") {
      return t(`expeditions.BATTLE_VICTORY_STREAK_DESCRIPTION`, data)
    } else {
      const battleStatLabelMapping: Record<BattleStat, string> = {
        maxHP: t(`stat.HP`),
        maxAttack: t(`stat.ATK`),
        maxDefense: t(`stat.DEF`),
        maxAP: t(`stat.AP`),
        maxSpecialDefense: t(`stat.SPE_DEF`),
        maxSpeed: t(`stat.SPEED`),
        maxPhysicalDamage: t(`physical_damage_dealt`),
        maxSpecialDamage: t(`special_damage_dealt`),
        maxTrueDamage: t(`true_damage_dealt`),
        maxShield: t(`shield_given`),
        maxHeal: t(`hp_healed`),
        maxVictoryStreak: t(`streak`)
      }
      return t(`expeditions.BATTLE_DESCRIPTION`, {
        ...data,
        battleStat: battleStatLabelMapping[data.stat] || data.stat
      })
    }
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
      const pokemonsOfCategory = precomputedPokemons.filter(
        (p) =>
          p.stars === (expedition.rank === "E" ? 2 : 3) && p.rarity === rarity
      )
      const pokemonToRescue =
        pokemonsOfCategory[expedition.hash % pokemonsOfCategory.length]
      return { pokemon: pokemonToRescue.name }
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
      const stat = BattleStatsList[expedition.hash % BattleStatsList.length]
      const AMOUNTS_BY_RANK: Record<
        ExpeditionRank,
        Record<BattleStat, number>
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
          maxVictoryStreak: 5
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
          maxVictoryStreak: 6
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
          maxVictoryStreak: 7
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
          maxVictoryStreak: 8
        },
        A: {
          maxAttack: 200,
          maxDefense: 200,
          maxSpecialDefense: 200,
          maxSpeed: 270,
          maxHP: 1250,
          maxAP: 400,
          maxPhysicalDamage: 1500,
          maxSpecialDamage: 1500,
          maxTrueDamage: 750,
          maxShield: 750,
          maxHeal: 750,
          maxVictoryStreak: 9
        },
        S: {
          maxAttack: 300,
          maxDefense: 300,
          maxSpecialDefense: 300,
          maxSpeed: 300,
          maxHP: 1500,
          maxAP: 500,
          maxPhysicalDamage: 2000,
          maxSpecialDamage: 2000,
          maxTrueDamage: 1000,
          maxShield: 1000,
          maxHeal: 1000,
          maxVictoryStreak: 10
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
