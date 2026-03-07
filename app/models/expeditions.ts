import {
  Expedition,
  ExpeditionRank,
  ExpeditionType
} from "../types/enum/Expedition"
import {
  IUserMetadataClient,
  IUserMetadataMongo,
  IUserMetadataUnpacked
} from "../types/interfaces/UserMetadata"

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
