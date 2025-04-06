import { BotV2, IBot, IStep } from "../models/mongo-models/bot-v2"
import { nanoid } from "nanoid"
import { mongo } from "mongoose"
import { logger, matchMaker } from "colyseus"
import { rewriteBotRoundsRequiredto1, validateBot } from "../core/bot-logic"

export async function fetchBots() {
  const bots = new Map<string, IBot>()
  const ids = new Array<string>()
  const chunkSize = 100
  let skip = 0

  while (true) {
    const botsData = await BotV2.find(
      {},
      {},
      { sort: { elo: -1 }, limit: chunkSize, skip }
    )
    if (!botsData || botsData.length === 0) break

    botsData.forEach((bot) => {
      if (ids.includes(bot.id)) {
        const id = nanoid()
        bot.id = id
        bot.save()
      }
      ids.push(bot.id)
      bots.set(bot.id, bot)
      matchMaker.presence.hset("bots", bot.id, JSON.stringify(bot))
    })

    skip += chunkSize
  }

  return bots
}

export async function getBotsList(): Promise<Partial<IBot>[]> {
  const bots = Object.values(await matchMaker.presence.hgetall("bots")).map(
    (bot) => JSON.parse(bot) as IBot
  )
  return bots.map((bot) => {
    const errors = validateBot(rewriteBotRoundsRequiredto1(bot))
    return {
      name: bot.name,
      avatar: bot.avatar,
      id: bot.id,
      author: bot.author,
      elo: bot.elo,
      valid: errors.length === 0
    }
  })
}

export async function getBotData(id: string): Promise<IBot | undefined> {
  try {
    const json = await matchMaker.presence.hget("bots", id)
    if (!json) return undefined
    return JSON.parse(json) as IBot
  } catch (e) {
    logger.error(`Error parsing bot data id ${id}: ${e}`)
    return undefined
  }
}

export async function addBotToDatabase(json: {
  name: string
  avatar: string
  elo: number
  author: string
  steps: IStep[]
}): Promise<IBot> {
  const resultCreate = await BotV2.create({
    name: json.name,
    avatar: json.avatar,
    elo: json.elo ?? 1200,
    author: json.author,
    steps: json.steps,
    id: nanoid()
  })

  logger.info(`Bot with id ${resultCreate.id} created`)

  matchMaker.presence.hset(
    "bots",
    resultCreate.id,
    JSON.stringify(resultCreate)
  )
  return resultCreate
}

export async function deleteBotFromDatabase(
  id: string
): Promise<mongo.DeleteResult> {
  const resultDelete = await BotV2.deleteOne({ id })
  matchMaker.presence.hdel("bots", id)
  if (resultDelete.deletedCount > 0) {
    logger.info(`Bot with id ${id} deleted`)
  }
  return resultDelete
}
