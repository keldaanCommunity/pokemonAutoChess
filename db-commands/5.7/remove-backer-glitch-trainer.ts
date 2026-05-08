import dotenv from "dotenv"
import { connect } from "mongoose"
import userMetadata from "../../app/models/mongo-models/user-metadata"
import { Title } from "../../app/types"
import { logger } from "../../app/utils/logger"

type TitleFromOlderVersion = Title

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...")
    const db = await connect(process.env.MONGO_URI!)
    logger.info("remove glitch trainer title ...")
    const removeGlitchTrainersTitle = await userMetadata.updateMany(
      { title: "GLITCH_TRAINER" as TitleFromOlderVersion },
      { title: Title.NOVICE }
    )
    logger.info(removeGlitchTrainersTitle)
    logger.info("remove backer title ...")
    const removeBackerTitle = await userMetadata.updateMany(
      { title: "BACKER" as TitleFromOlderVersion },
      { title: Title.NOVICE }
    )
    logger.info(removeBackerTitle)
    logger.info("remove glitch trainer titles ...")
    const removeGlitchTrainerTitles = await userMetadata.updateMany(
      { titles: { $in: ["GLITCH_TRAINER" as TitleFromOlderVersion] } },
      { $pull: { titles: "GLITCH_TRAINER" as TitleFromOlderVersion } }
    )
    logger.info(removeGlitchTrainerTitles)
    logger.info("remove backer titles ...")
    const removeBackerTitles = await userMetadata.updateMany(
      { titles: { $in: ["BACKER" as TitleFromOlderVersion] } },
      { $pull: { titles: "BACKER" as TitleFromOlderVersion } }
    )
    logger.info(removeBackerTitles)
    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
