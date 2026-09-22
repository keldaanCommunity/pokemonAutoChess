import dotenv from "dotenv"
import { connect } from "mongoose"
import UserMetadata from "../../app/models/mongo-models/user-metadata"
import { logger } from "../../app/utils/logger"

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...")
    const db = await connect(process.env.MONGO_URI!)

    logger.info("Finding duplicated UserMetadata entries...")

    // Use aggregation to find all UIDs that have duplicates
    const duplicateUIDs = await UserMetadata.aggregate([
      {
        $group: {
          _id: "$uid",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      },
      {
        $project: {
          uid: "$_id",
          count: 1,
          _id: 0
        }
      }
    ])

    logger.info(`Found ${duplicateUIDs.length} UIDs with duplicates`)

    let totalDuplicatesRemoved = 0

    // Process each duplicate UID
    for (const { uid, count } of duplicateUIDs) {
      logger.info(`Processing UID: ${uid} with ${count} entries`)

      // Find all entries for this UID
      const allEntries = await UserMetadata.find({ uid })

      if (allEntries.length > 1) {
        const sortedEntries = allEntries.sort((a, b) => {
          if (a.level !== b.level) return b.level - a.level
          if (a.elo !== b.elo) return b.elo - a.elo
          if (a.wins !== b.wins) return b.wins - a.wins
          return b.exp - a.exp
        })

        const entryToKeep = sortedEntries[0]
        const entriesToRemove = sortedEntries.slice(1)

        logger.info(
          `Keeping entry with level: ${entryToKeep.level}, elo: ${entryToKeep.elo}`
        )
        logger.info(`Removing ${entriesToRemove.length} duplicate entries`)

        for (const entryToRemove of entriesToRemove) {
          await UserMetadata.findByIdAndDelete(entryToRemove._id)
          totalDuplicatesRemoved++
        }
      }
    }

    logger.info(
      `Purge completed. Removed ${totalDuplicatesRemoved} duplicate UserMetadata entries.`
    )

    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
