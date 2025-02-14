import { BotV2, IBot } from "../models/mongo-models/bot-v2"
import { nanoid } from "nanoid"
import { mongo } from "mongoose"

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

export async function getBotsList(
  options: { withSteps: boolean } = { withSteps: true }
): Promise<Partial<IBot>[]> {
  if (bots.size === 0) {
    await fetchBots()
  }
  return [...bots.values()].map((bot) => ({
    name: bot.name,
    avatar: bot.avatar,
    id: bot.id,
    author: bot.author,
    elo: bot.elo,
    ...(options.withSteps ? { steps: bot.steps } : {})
  }))
}

export function getBotData(id: string): IBot | undefined {
  return bots.get(id)
}

export async function addBotToDatabase(json: {
  name: string
  avatar: string
  elo: number
  author: string
  steps: number
}): Promise<IBot> {
  const resultCreate = await BotV2.create({
    name: json.name,
    avatar: json.avatar,
    elo: json.elo ?? 1200,
    author: json.author,
    steps: json.steps,
    id: nanoid()
  })

  bots.set(resultCreate.id, resultCreate)
  return resultCreate
}

export async function deleteBotFromDatabase(
  id: string
): Promise<mongo.DeleteResult> {
  const resultDelete = await BotV2.deleteOne({ id })
  bots.delete(id)
  return resultDelete
}
