import dotenv from "dotenv"
import { connect } from "mongoose"
import { IBot } from "../app/models/mongo-models/bot-v2"
import { pastebinService } from "../app/services/pastebin"
import { logger } from "../app/utils/logger"
import { addBots } from "./support/populate-bot"
const args = process.argv.slice(2)

async function main() {
  dotenv.config()

  const url = args[0]
  if (!url) {
    logger.error(`Usage: npm run add-bot <pastebin-url>`)
    process.exit(1)
  }

  const id = url.slice(21)
  logger.debug(`retrieving id: ${id} ...`)
  const data = await pastebinService.getPaste(id, false)
  if (!data) {
    logger.error("No data found for this pastebin url")
    process.exit(1)
  }

  logger.debug("parsing JSON data ...")
  let botData: IBot | IBot[]
  try {
    botData = JSON.parse(data)
  } catch (e) {
    logger.error("Parsing error:", e)
    process.exit(1)
  }

  logger.debug("connect to db ...")
  const db = await connect(process.env.MONGO_URI!)

  await addBots(botData)

  await db.disconnect()
}

main()
