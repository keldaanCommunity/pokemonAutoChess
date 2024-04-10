import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../app/models/mongo-models/bot-v2"
import { Item } from "../app/types/enum/Item"
import { logger } from "../app/utils/logger"

async function main() {
  dotenv.config({
    path:
      process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development"
  })

  try {
    logger.info("connect to db ...")
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const db = await connect(process.env.MONGO_URI!)
    const bots = await BotV2.find()
    for (let i = 0; i < bots.length; i++) {
      let modified = false
      const bot = bots[i]
      bot.steps.forEach((step) => {
        step.board.forEach((p) => {
          for (let j = 0; j < p.items.length; j++) {
            const item = p.items[j] as any
            if (item === "ORAN_BERRY") {
              logger.debug(p.name, item)
              p.items[j] = Item.KINGS_ROCK
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
    await db.disconnect()
  } catch (e) {
    logger.error("Parsing error:", e)
  }
}

main()
