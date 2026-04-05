import { getBaseAltForm } from "../config"
import { ExpPerExpeditionRank } from "../config/game/expeditions"
import { getExpeditionData, getPlayerExpeditions } from "../core/expeditions"
import { notificationsService } from "../services/notifications"
import { IPlayer, Title } from "../types"
import {
  BattleMissionData,
  DeliveryMissionData,
  Expedition,
  ExpeditionRank,
  ExpeditionType,
  ExplorationMissionData,
  RescueMissionData
} from "../types/enum/Expedition"
import { IUserMetadataMongo } from "../types/interfaces/UserMetadata"
import { values } from "../utils/schemas"
import { giveUserExp } from "./mongo-models/user-metadata"

export function updatePlayerExpeditionsAfterGame(
  player: IPlayer,
  usr: IUserMetadataMongo
): boolean {
  const expeditions = getPlayerExpeditions(usr)
  let hasCompletedExpeditions = false
  expeditions.forEach((expedition) => {
    if (checkExpeditionCompletion(player, expedition)) {
      // mark expedition as completed in the database
      usr.eventPoints++
      usr.maxEventPoints = Math.max(usr.maxEventPoints, usr.eventPoints)
      hasCompletedExpeditions = true
      const points = ExpPerExpeditionRank[expedition.rank]
      notificationsService.addNotification(
        player.id,
        "expedition_completed",
        `${expedition.type}|${expedition.rank}|${points}`
      )
      giveUserExp(usr, points)
      switch (expedition.type) {
        case ExpeditionType.RESCUE:
          player.titles.add(Title.RESCUE_TEAM_MEMBER)
          break
        case ExpeditionType.EXPLORATION:
          player.titles.add(Title.EXPLORER)
          break
        case ExpeditionType.BATTLE:
          player.titles.add(Title.SURVEY_CORPS)
          break
        case ExpeditionType.DELIVERY:
          player.titles.add(Title.POSTMAN)
          break
      }
      if (expedition.rank === ExpeditionRank.S) {
        player.titles.add(Title.GUILDMASTER)
      }
    }
  })
  return hasCompletedExpeditions
}

export function checkExpeditionCompletion(
  player: IPlayer,
  expedition: Expedition
): boolean {
  switch (expedition.type) {
    case ExpeditionType.RESCUE: {
      const expeditionData = getExpeditionData(expedition) as RescueMissionData
      const pokemonToRescue = getBaseAltForm(expeditionData.pokemon)
      return values(player.board).some(
        (p) => getBaseAltForm(p.name) === pokemonToRescue
      )
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
        (player.gameStats[expeditionData.stat] ?? 0) >= expeditionData.amount
      )
    }

    case ExpeditionType.DELIVERY: {
      const expeditionData = getExpeditionData(
        expedition
      ) as DeliveryMissionData
      const items = [
        ...player.items,
        ...values(player.board).flatMap((p) => values(p.items))
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
