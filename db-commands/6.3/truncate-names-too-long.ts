// Duke title changed, removing old title for all players
import dotenv from "dotenv"
import { connect } from "mongoose"
import { logger } from "../../app/utils/logger"
import UserMetadata from "../../app/models/mongo-models/user-metadata"
// Truncate all display names to 24 characters max

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...", process.env.MONGO_URI!)
    const db = await connect(process.env.MONGO_URI!)

    logger.info("Truncate all display names to 24 characters max")
    const docs = await UserMetadata.find({
      $expr: { $gt: [{ $strLenCP: "$displayName" }, 24] }
    })

    for (const doc of docs) {
      logger.info(
        `Truncated displayName from ${doc.displayName} to ${doc.displayName.slice(0, 24)}`
      )
      doc.displayName = doc.displayName.slice(0, 24)
      await doc.save()
    }

    logger.info("Update complete, disconnecting from db...")

    await db.disconnect()
  } catch (e) {
    logger.error("Error:", e)
  }
}

main()
