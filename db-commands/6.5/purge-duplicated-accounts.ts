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

        const batchSize = 1000
        let skip = 0
        let totalDuplicatesRemoved = 0
        let processedUIDs = new Set()

        while (true) {
            const batch = await UserMetadata.find({}).skip(skip).limit(batchSize)
            if (batch.length === 0) break

            logger.info(`Processing batch ${skip / batchSize + 1}, ${batch.length} entries`)

            // Group by UID within this batch
            const uidGroups = new Map()
            for (const entry of batch) {
                if (processedUIDs.has(entry.uid)) continue
                if (!uidGroups.has(entry.uid)) {
                    uidGroups.set(entry.uid, [])
                }
                uidGroups.get(entry.uid).push(entry)
            }

            // Process duplicates in this batch
            for (const [uid, entries] of uidGroups) {
                if (entries.length > 1) {
                    // Find all entries for this UID across the entire collection
                    const allEntries = await UserMetadata.find({ uid })
                    
                    if (allEntries.length > 1) {
                        logger.info(`Processing UID: ${uid} with ${allEntries.length} entries`)

                        const sortedEntries = allEntries.sort((a, b) => {
                            if (a.level !== b.level) return b.level - a.level
                            if (a.elo !== b.elo) return b.elo - a.elo
                            if (a.wins !== b.wins) return b.wins - a.wins
                            return b.exp - a.exp
                        })

                        const entryToKeep = sortedEntries[0]
                        const entriesToRemove = sortedEntries.slice(1)

                        logger.info(`Keeping entry with level: ${entryToKeep.level}, elo: ${entryToKeep.elo}`)
                        logger.info(`Removing ${entriesToRemove.length} duplicate entries`)

                        for (const entryToRemove of entriesToRemove) {
                            await UserMetadata.findByIdAndDelete(entryToRemove._id)
                            totalDuplicatesRemoved++
                        }
                    }
                }
                processedUIDs.add(uid)
            }

            skip += batchSize
        }

        logger.info(`Purge completed. Removed ${totalDuplicatesRemoved} duplicate UserMetadata entries.`)

        await db.disconnect()
    } catch (e) {
        logger.error("Parsing error:", e)
    }
}

main()
