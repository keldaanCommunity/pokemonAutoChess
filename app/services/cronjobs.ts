import { CronJob } from "cron"
import dayjs from "dayjs"
import admin from "firebase-admin"
import { UserRecord } from "firebase-admin/lib/auth/user-record"
import {
  CRON_ELO_DECAY_DELAY,
  CRON_ELO_DECAY_MINIMUM_ELO,
  CRON_HISTORY_CLEANUP_DELAY,
  ELO_DECAY_LOST_PER_DAY,
  EloRankThreshold
} from "../config"
import DetailledStatistic from "../models/mongo-models/detailled-statistic-v2"
import TitleStatistic from "../models/mongo-models/title-statistic"
import UserMetadata from "../models/mongo-models/user-metadata"
import { Title } from "../types"
import { EloRank } from "../types/enum/EloRank"
import { GameMode } from "../types/enum/Game"
import { logger } from "../utils/logger"
import { min } from "../utils/number"

export function initCronJobs() {
  logger.debug("init cron jobs")

  CronJob.from({
    cronTime: "0 8 * * *", // every day at 8am
    timeZone: "Europe/Paris",
    onTick: () => deleteOldAnonymousAccounts(),
    start: true
  })
  CronJob.from({
    cronTime: "15 8 * * *", // every day at 8:15am
    timeZone: "Europe/Paris",
    onTick: () => deleteOldHistory(),
    start: true
  })
  CronJob.from({
    cronTime: "30 8 * * *", // every day at 8:30am
    timeZone: "Europe/Paris",
    onTick: () => eloDecay(),
    start: true
  })
  CronJob.from({
    cronTime: "45 8 * * *", // every day at 8:45am
    timeZone: "Europe/Paris",
    onTick: () => titleStats(),
    start: true
  })
  CronJob.from({
    cronTime: "0 0 1 * *", // at midnight UTC on the first day of each month
    timeZone: "UTC",
    onTick: () => resetEventScores(),
    start: true
  })
}

async function deleteOldAnonymousAccounts() {
  logger.info("[CRON] Deleting old anonymous accounts...")
  const currentDate = dayjs() // Get the current date and time
  const oneMonthLimit = currentDate.subtract(1, "month")
  const anonymousAccounts = new Array<UserRecord>()
  await listAllUsers()

  async function listAllUsers(nextPageToken?: string) {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken)
    //logger.debug(nextPageToken)
    listUsersResult.users.forEach((userRecord) => {
      const lastSignInDate = dayjs(userRecord.metadata.lastSignInTime)
      if (
        userRecord.email === undefined &&
        userRecord.photoURL === undefined &&
        userRecord.metadata.lastSignInTime &&
        lastSignInDate.isBefore(oneMonthLimit)
      ) {
        anonymousAccounts.push(userRecord)
      }
    })
    if (listUsersResult.pageToken) {
      // List next batch of users.
      await listAllUsers(listUsersResult.pageToken)
    }
  }

  logger.info(
    `deleting ${anonymousAccounts.length} inactive anonymous accounts`
  )

  while (anonymousAccounts.length > 0) {
    const batchDeletion = new Array<string>()
    for (let i = 0; i < 999; i++) {
      const account = anonymousAccounts.pop()
      account && batchDeletion.push(account.uid)
    }
    const firebaseDeletion = await admin.auth().deleteUsers(batchDeletion)
    logger.info("firebase deletion result ", firebaseDeletion)
    const pacDeletion = await UserMetadata.deleteMany({
      uid: { $in: batchDeletion }
    })
    logger.info("pac deletion result ", pacDeletion)
  }
}

async function eloDecay() {
  logger.info("[CRON] Computing elo decay...")
  const users = await UserMetadata.find(
    { elo: { $gt: CRON_ELO_DECAY_MINIMUM_ELO } },
    ["uid", "elo", "displayName"]
  )
  if (users && users.length > 0) {
    logger.info(`Checking activity of ${users.length} users`)
    for (let i = 0; i < users.length; i++) {
      const u = users[i]
      const stats = await DetailledStatistic.find(
        {
          playerId: u.uid,
          ...(u.elo >= EloRankThreshold[EloRank.ULTRA_BALL]
            ? { gameMode: GameMode.RANKED }
            : {})
        },
        ["time"],
        {
          limit: 3,
          sort: { time: -1 }
        }
      )

      const shouldDecay =
        stats.length < 3 || Date.now() - stats[2].time > CRON_ELO_DECAY_DELAY

      if (shouldDecay) {
        const eloAfterDecay = min(CRON_ELO_DECAY_MINIMUM_ELO)(
          u.elo - ELO_DECAY_LOST_PER_DAY
        )
        logger.info(
          `User ${u.displayName} (${u.elo}) will decay to ${eloAfterDecay}`
        )
        u.elo = eloAfterDecay
        await u.save()
      }
    }
  } else {
    logger.info("No users to check")
  }
}

async function titleStats() {
  logger.info("[CRON] Recomputing title statistics...")
  const count = await UserMetadata.countDocuments()
  logger.info(`${count} users found`)
  for (const title of Object.values(Title)) {
    const titleCount = await UserMetadata.countDocuments({
      titles: { $in: title }
    })
    await TitleStatistic.deleteMany({ name: title })
    await TitleStatistic.create({ name: title, rarity: titleCount / count })
  }
}

async function deleteOldHistory() {
  logger.info("[CRON] Deleting 4 weeks old games...")
  const deleteResults = await DetailledStatistic.deleteMany({
    time: { $lt: Date.now() - CRON_HISTORY_CLEANUP_DELAY }
  })
  logger.info(`${deleteResults.deletedCount} detailed statistics deleted`)
}

async function resetEventScores() {
  try {
    logger.info("[CRON] Starting event scores reset...")

    // Reset event-related fields for all users in a single operation
    const result = await UserMetadata.updateMany(
      {
        $or: [
          { eventPoints: { $gt: 0 } },
          { maxEventPoints: { $gt: 0 } },
          { eventFinishTime: { $ne: null } }
        ]
      },
      {
        $set: {
          eventPoints: 0,
          maxEventPoints: 0,
          eventFinishTime: null
        }
      }
    )

    logger.info(
      `Event reset completed! Reset event data for ${result.modifiedCount} users`
    )
  } catch (e) {
    logger.error("Error during event reset scores:", e)
  }
}
