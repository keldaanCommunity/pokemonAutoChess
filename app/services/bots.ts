import { BotV2, IBot } from "../models/mongo-models/bot-v2"
import { nanoid } from "nanoid"

const bots = new Map<string, IBot>()

export async function fetchBots() {
  const botsData = await BotV2.find({}, {}, { sort: { elo: -1 } })
  if (botsData) {
    const ids = new Array<string>()
    botsData.forEach((bot, i) => {
      if (ids.includes(bot.id)) {
        const id = nanoid()
        bot.id = id
        bot.save()
      }
      ids.push(bot.id)
      bots.set(bot.id, bot)
    })
  }
  return bots
}

export function createBotList(
  bots: Map<string, IBot>,
  options: { withSteps: boolean } = { withSteps: true }
): Partial<IBot>[] {
  return [...bots.values()].map((bot) => ({
    name: bot.name,
    avatar: bot.avatar,
    id: bot.id,
    author: bot.author,
    elo: bot.elo,
    ...(options.withSteps ? { steps: bot.steps } : {})
  }))
}
