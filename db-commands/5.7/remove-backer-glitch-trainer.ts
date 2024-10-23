import dotenv from "dotenv"
import { connect } from "mongoose"
import userMetadata from "../../app/models/mongo-models/user-metadata"
import { Title } from "../../app/types"
import { logger } from "../../app/utils/logger"

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...")
    const db = await connect(process.env.MONGO_URI!)
    logger.info("remove glitch trainer title ...")
    const removeGlitchTrainersTitle = await userMetadata.updateMany(
      { title: "GLITCH_TRAINER" },
      { title: Title.NOVICE }
    )
    logger.info(removeGlitchTrainersTitle)
    logger.info("remove backer title ...")
    const removeBackerTitle = await userMetadata.updateMany(
      { title: "BACKER" },
      { title: Title.NOVICE }
    )
    logger.info(removeBackerTitle)
    logger.info("remove glitch trainer titles ...")
    const removeGlitchTrainerTitles = await userMetadata.updateMany(
      { titles: { $in: ["GLITCH_TRAINER"] } },
      { $pull: { titles: "GLITCH_TRAINER" } }
    )
    logger.info(removeGlitchTrainerTitles)
    logger.info("remove backer titles ...")
    const removeBackerTitles = await userMetadata.updateMany(
      { titles: { $in: ["BACKER"] } },
      { $pull: { titles: "BACKER" } }
    )
    logger.info(removeBackerTitles)
    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
