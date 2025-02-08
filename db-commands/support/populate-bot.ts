import { connect, Mongoose } from "mongoose"
import { nanoid } from "nanoid"
import { BotV2, IBot } from "../../app/models/mongo-models/bot-v2"
import { logger } from "../../app/utils/logger"
import { wrapInArray } from "../../app/utils/array"

export async function addBots(bots: IBot | IBot[]) {
  for (const bot of wrapInArray(bots)) {
    try {
      const resultDelete = await BotV2.deleteMany({
        avatar: bot.avatar,
        author: bot.author
      })
      logger.debug(resultDelete)
      logger.debug(`creating BotV2 ${bot.avatar} by ${bot.author}...`)
      const resultCreate = await BotV2.create({
        name: bot.name,
        avatar: bot.avatar,
        elo: bot.elo ? bot.elo : 1200,
        author: bot.author,
        steps: bot.steps,
        id: nanoid()
      })
      logger.debug(
        resultCreate.id,
        resultCreate.name,
        resultCreate.avatar,
        resultCreate.author,
        resultCreate.elo
      )
    } catch (e) {
      logger.error("Error adding to DB:", e)
    }
  }
}
