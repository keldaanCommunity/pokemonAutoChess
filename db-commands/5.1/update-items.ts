import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../../app/models/mongo-models/bot-v2"
import { ItemsStatistics } from "../../app/models/mongo-models/items-statistic"
import { Item } from "../../app/types/enum/Item"
import { logger } from "../../app/utils/logger"

const itemsToReplace = new Map<string, Item>([
  ["ORAN_BERRY", Item.KINGS_ROCK],
  ["LEFTOVERS", Item.SOOTHE_BELL],
  ["DELTA_ORB", Item.GREEN_ORB]
])

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...")
    const db = await connect(process.env.MONGO_URI!)
    const bots = await BotV2.find()
    for (let i = 0; i < bots.length; i++) {
      let modified = false
      const bot = bots[i]
      bot.steps.forEach((step) => {
        step.board.forEach((p) => {
          for (let j = 0; j < p.items.length; j++) {
            const item = p.items[j] as string
            if (itemsToReplace.has(item)) {
              logger.debug(
                `Bot ${
                  bot.name
                }: Replacing item ${item} by ${itemsToReplace.get(item)} for ${
                  p.name
                }`
              )
              p.items[j] = itemsToReplace.get(item)!
              modified = true
            }
          }
        })
      })
      if (modified) {
        bot.markModified("steps")
        await bot.save()
      }
    }

    const itemsStatistics = await ItemsStatistics.find()
    for (let i = 0; i < itemsStatistics.length; i++) {
      let modified = false
      const itemStat = itemsStatistics[i]
      if (itemsToReplace.has(itemStat.name)) {
        logger.debug(
          `ItemStat: Replacing item ${itemStat.name} by ${itemsToReplace.get(
            itemStat.name
          )}`
        )
        itemStat.name = itemsToReplace.get(itemStat.name)!
        modified = true
      }
      if (modified) {
        itemStat.markModified("name")
        await itemStat.save()
      }
    }

    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
