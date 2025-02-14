import dotenv from "dotenv"
import { connect } from "mongoose"
import { nanoid } from "nanoid"
import { BotV2, IBot } from "../app/models/mongo-models/bot-v2"
import { logger } from "../app/utils/logger"
import { readFile } from "fs/promises"
import { addBots } from "./support/populate-bot"

async function main() {
  dotenv.config()

  logger.debug("retrieving data ...")
  const data = await readFile(
    process.argv[2] || "db-commands/botv2.json",
    "utf8"
  )
  if (!data) {
    logger.error("Couldn't load botv2.json")
    process.exit(1)
  }

  logger.debug("parsing JSON data ...")
  let botData: IBot[]
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
