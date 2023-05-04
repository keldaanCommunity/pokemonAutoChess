import dotenv from "dotenv"
import { connect } from "mongoose"
import BotV2 from "../app/models/mongo-models/bot-v2"
import { Item } from "../app/types/enum/Item"

async function main() {
  dotenv.config()

  try {
    console.log("connect to db ...")
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
            if (item === "KINGS_ROCK") {
              console.log(p.name, item)
              p.items[j] = Item.AMULET_COIN
              modified = true
            } else if (item === "WATER_INCENSE") {
              console.log(p.name, item)
              p.items[j] = Item.POWER_LENS
              modified = true
            } else if (item === "BRIGHT_POWDER") {
              console.log(p.name, item)
              p.items[j] = Item.STAR_DUST
              modified = true
            } else if (item === "ZOOM_LENS") {
              console.log(p.name, item)
              p.items[j] = Item.SCOPE_LENS
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
    console.error("Parsing error:", e)
  }
}

main()
