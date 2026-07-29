import dotenv from "dotenv"
import { connect } from "mongoose"
import userMetadata from "../../app/models/mongo-models/user-metadata"
import BannedUser from "../../app/models/mongo-models/banned-user"
import { logger } from "../../app/utils/logger"

/* Move BannedUser to a banned optional boolean in UserMetadata */
async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...", process.env.MONGO_URI!)
    const db = await connect(process.env.MONGO_URI!)

    const bannedList = await BannedUser.find({})
    const bannedUids = bannedList.map((banned) => banned.uid)
    logger.info("Banned UIDs:", bannedUids)

    logger.info("migrate banned flag ...")
    const res = await userMetadata.updateMany(
      { uid: { $in: bannedUids } },
      { banned: true }
    )
    logger.info(
      `${res.matchedCount} users matched, ${res.modifiedCount} modified`
    )
    logger.info(
      `BannedUser collection should be removed manually after checking if migration was successful`
    )

    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
