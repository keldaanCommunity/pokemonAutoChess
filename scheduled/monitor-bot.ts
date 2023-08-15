import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../app/models/mongo-models/bot-v2"
import BotMonitor from "../app/models/mongo-models/bot-monitoring"
import { logger } from "../app/utils/logger"

async function main() {
  dotenv.config()
  logger.info("connection to db...")
  if (process.env.MONGO_URI) {
    const connection = await connect(process.env.MONGO_URI)
    if (connection) {
      logger.info("loading bots ...")
      const bots = await BotV2.find(
        {},
        ["avatar", "elo", "name", "author"],
        null
      )
      await Promise.all(
        bots.map(async (bot) => {
          try {
            logger.info(`finding bot ${bot.name}...`)
            const botMonitor = await BotMonitor.findOne({ avatar: bot.avatar })
            logger.info(`updating bot ${bot.name}...`)
            if (botMonitor) {
              botMonitor.data.push({ time: Date.now(), elo: bot.elo })
              await botMonitor.save()
            }
          } catch (err) {
            logger.info(`creating bot ${bot.name}...`)
            await BotMonitor.create({
              avatar: bot.avatar,
              author: bot.author,
              name: bot.name,
              data: [{ time: Date.now(), elo: bot.elo }]
            })
          }
        })
      )
      logger.info("closing connection ...")
      connection.disconnect()
    }
  }
}

main()
