import dotenv from "dotenv"
import { connect } from "mongoose"
import { logger } from "../../app/utils/logger"
import UserMetadata from "../../app/models/mongo-models/user-metadata"


async function main() {
    dotenv.config()

    try {
        logger.info("connect to db ...")
        const db = await connect(process.env.MONGO_URI!)

        logger.info("Finding duplicated UserMetadata entries...")

        // Find all users grouped by uid to identify duplicates
        const duplicateGroups = await UserMetadata.aggregate([
            {
                $group: {
                    _id: "$uid",
                    entries: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ])

        logger.info(`Found ${duplicateGroups.length} UIDs with duplicated entries`)

        let totalDuplicatesRemoved = 0

        for (const group of duplicateGroups) {
            const { _id: uid, entries } = group
            logger.info(`Processing UID: ${uid} with ${entries.length} entries`)

            // Sort entries to find the best one to keep
            // Priority: highest level, then highest elo, then highest wins, then highest exp
            const sortedEntries = entries.sort((a, b) => {
                if (a.level !== b.level) return b.level - a.level
                if (a.elo !== b.elo) return b.elo - a.elo
                if (a.wins !== b.wins) return b.wins - a.wins
                return b.exp - a.exp
            })

            const entryToKeep = sortedEntries[0]
            const entriesToRemove = sortedEntries.slice(1)

            logger.info(`Keeping entry with level: ${entryToKeep.level}, elo: ${entryToKeep.elo}, wins: ${entryToKeep.wins}, exp: ${entryToKeep.exp}`)
            logger.info(`Removing ${entriesToRemove.length} duplicate entries`)

            // Remove the duplicate entries
            for (const entryToRemove of entriesToRemove) {
                await UserMetadata.findByIdAndDelete(entryToRemove._id)
                logger.info(`Removed entry with level: ${entryToRemove.level}, elo: ${entryToRemove.elo}, wins: ${entryToRemove.wins}, exp: ${entryToRemove.exp}`)
                totalDuplicatesRemoved++
            }
        }

        logger.info(`Purge completed. Removed ${totalDuplicatesRemoved} duplicate UserMetadata entries.`)

        await db.disconnect()
    } catch (e) {
        logger.error("Parsing error:", e)
    }
}

main()
