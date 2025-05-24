// Duke title changed, removing old title for all players
import dotenv from "dotenv"
import { connect } from "mongoose"
import { logger } from "../../app/utils/logger"
import UserMetadata from "../../app/models/mongo-models/user-metadata"
import { Title } from "../../app/types"
import titleStatistic from "../../app/models/mongo-models/title-statistic"

async function main() {
    dotenv.config()

    try {
        logger.info("connect to db ...", process.env.MONGO_URI!)
        const db = await connect(process.env.MONGO_URI!)

        logger.info("Remove the old Duke title for all players")
        const res = await UserMetadata.updateMany({}, { $pull: { titles: Title.DUKE } })

        logger.info(
            `Role Duke removed for ${res.modifiedCount} players`
        )

        await titleStatistic.deleteOne({ name: Title.DUKE })

        logger.info("Title statistic for Duke removed")

        await db.disconnect()
    } catch (e) {
        logger.error("Parsing error:", e)
    }
}

main()
