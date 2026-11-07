import { matchMaker } from "colyseus"
import { TARGETED_ELO_AVERAGE } from "../config/game/elo"
import DetailledStatistic from "../models/mongo-models/detailled-statistic-v2"
import UserMetadata from "../models/mongo-models/user-metadata"
import { logger } from "../utils/logger"

const ELO_AVERAGE_PRESENCE_KEY = "elo-average"

export async function computeAndStoreAverageElo(): Promise<number | null> {
  try {
    const [result] = await DetailledStatistic.aggregate<{
      averageElo: number
      count: number
    }>([
      { $group: { _id: "$playerId" } },
      {
        $lookup: {
          from: UserMetadata.collection.name,
          localField: "_id",
          foreignField: "uid",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: null,
          averageElo: { $avg: "$user.elo" },
          count: { $sum: 1 }
        }
      }
    ])

    if (!result) {
      logger.info("[ELO] No recent players found, keeping previous average")
      return null
    }

    const averageElo = Math.round(result.averageElo)
    await matchMaker.presence.set(ELO_AVERAGE_PRESENCE_KEY, String(averageElo))
    logger.info(
      `[ELO] Average elo of ${result.count} recent players: ${averageElo} (target: ${TARGETED_ELO_AVERAGE})`
    )
    return averageElo
  } catch (error) {
    logger.error("[ELO] Failed to compute average elo", error)
    return null
  }
}

export async function getAverageElo(): Promise<number> {
  try {
    const stored = Number(
      await matchMaker.presence.get(ELO_AVERAGE_PRESENCE_KEY)
    )
    return Number.isFinite(stored) && stored > 0 ? stored : TARGETED_ELO_AVERAGE
  } catch (error) {
    logger.error("[ELO] Failed to read average elo from presence", error)
    return TARGETED_ELO_AVERAGE
  }
}
