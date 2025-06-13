// Duke title changed, removing old title for all players
import dotenv from "dotenv"
import { connect } from "mongoose"
import { logger } from "../../app/utils/logger"
import UserMetadata from "../../app/models/mongo-models/user-metadata"
import { Title } from "../../app/types"
import titleStatistic from "../../app/models/mongo-models/title-statistic"

// Duke title has changed, removing old title for all players
// Diver title has been replaced by Surfer for Aquatic 8

const titlesToRemove = [Title.DUKE, "DIVER"]

async function main() {
    dotenv.config()

    try {
        logger.info("connect to db ...", process.env.MONGO_URI!)
        const db = await connect(process.env.MONGO_URI!)

        logger.info("Remove the obsolete titles for all players")
        const res = await UserMetadata.updateMany({}, { $pull: { titles: { $in: titlesToRemove } } })

        logger.info(
            `Titles ${titlesToRemove.join(",")} removed for ${res.modifiedCount} players`
        )

        for (const title of titlesToRemove) {
            logger.info(`Remove title statistic for ${title}`)
            await titleStatistic.deleteOne({ name: title })
            logger.info(`Title statistic for ${title} removed`)
        }

        await db.disconnect()
    } catch (e) {
        logger.error("Parsing error:", e)
    }
}

main()
