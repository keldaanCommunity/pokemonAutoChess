import dotenv from "dotenv"
import { connect } from "mongoose"
import UserMetadata from "../app/models/mongo-models/user-metadata"
import { logger } from "../app/utils/logger"

async function main() {
    dotenv.config()

    try {
        logger.info("Connecting to database...")
        const db = await connect(process.env.MONGO_URI!)

        logger.info("Starting event scores reset...")

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

        logger.info(`Event reset completed! Reset event data for ${result.modifiedCount} users`)

        await db.disconnect()
        logger.info("Database connection closed")

    } catch (e) {
        logger.error("Error during event reset:", e)
        process.exit(1)
    }
}

main()