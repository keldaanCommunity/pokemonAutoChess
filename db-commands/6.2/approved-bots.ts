import dotenv from "dotenv"
import { connect } from "mongoose"
import { logger } from "../../app/utils/logger"
import { BotV2 } from "../../app/models/mongo-models/bot-v2"

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...", process.env.MONGO_URI!)
    const db = await connect(process.env.MONGO_URI!)

    logger.info("Update all bots to have the approved field set to true")
    const res = await BotV2.updateMany(
      { approved: { $exists: false } },
      { $set: { approved: true } }
    )

    logger.info(
      `${res.matchedCount} bots matched, ${res.modifiedCount} modified`
    )

    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
