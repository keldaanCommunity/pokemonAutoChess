import dotenv from "dotenv"
import { connect } from "mongoose"
import { BotV2 } from "../app/models/mongo-models/bot-v2"
import { Pkm } from "../app/types/enum/Pokemon"
import { logger } from "../app/utils/logger"

async function main() {
  dotenv.config()

  try {
    logger.info("connect to db ...")
    const db = await connect(process.env.MONGO_URI!)
    const bots = await BotV2.find()
    for (let i = 0; i < bots.length; i++) {
      let modified = false
      const bot = bots[i]
      if (bot.name === "MEGA_SCIZOR") {
        bot.name = Pkm.SCIZOR
        modified = true
        console.log(bot.name)
      }
      bot.steps.forEach((step) => {
        step.board.forEach((p) => {
          if (p.name === ("MEGA_SCIZOR" as Pkm)) {
            p.name = Pkm.SCIZOR
            modified = true
            console.log(p.name, "in BOT", bot.name, "by ", bot.author)
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
