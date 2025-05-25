import { BotV2, IBot, IStep } from "../models/mongo-models/bot-v2"
import { nanoid } from "nanoid"
import { mongo } from "mongoose"
import { logger, matchMaker } from "colyseus"
import { rewriteBotRoundsRequiredto1, validateBot } from "../core/bot-logic"
import { discordService } from "./discord"
import { IUserMetadata } from "../models/mongo-models/user-metadata"

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

    for (const bot of botsData) {
      if (ids.includes(bot.id)) {
        const id = nanoid()
        bot.id = id
        bot.save()
      }
      ids.push(bot.id)
      bots.set(bot.id, bot)
      await matchMaker.presence.hset("bots", bot.id, JSON.stringify(bot))
    }

    skip += chunkSize
  }

  return bots
}

export async function getBotsList(
  approved?: boolean
): Promise<Partial<IBot>[]> {
  const bots = Object.values(await matchMaker.presence.hgetall("bots")).map(
    (bot) => JSON.parse(bot) as IBot
  )
  return bots
    .filter((bot) => approved === undefined || bot.approved === approved)
    .map((bot) => {
      const errors = validateBot(rewriteBotRoundsRequiredto1(bot))
      return {
        name: bot.name,
        avatar: bot.avatar,
        id: bot.id,
        approved: bot.approved,
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

export async function addBotToDatabase(bot: {
  name: string
  avatar: string
  elo: number
  author: string
  steps: IStep[]
}): Promise<IBot> {
  logger.info(`Adding bot ${bot.name} created by ${bot.author}`)
  // before creating the bot, check if it already exists and delete the old one
  const resultDelete = await BotV2.deleteMany({
    avatar: bot.avatar,
    author: bot.author
  })
  const resultCreate = await BotV2.create({
    name: bot.name,
    avatar: bot.avatar,
    elo: bot.elo ?? 1200,
    author: bot.author,
    steps: bot.steps,
    id: nanoid()
  })

  logger.info(`Bot with id ${resultCreate.id} created`)
  matchMaker.presence.hset(
    "bots",
    resultCreate.id,
    JSON.stringify(resultCreate)
  )
  discordService.announceBotCreation(resultCreate)
  return resultCreate
}

export async function deleteBotFromDatabase(
  botId: string,
  user: IUserMetadata
): Promise<mongo.DeleteResult> {
  const resultDelete = await BotV2.deleteOne({ id: botId })
  matchMaker.presence.hdel("bots", botId)
  if (resultDelete.deletedCount > 0) {
    logger.info(`Bot with id ${botId} has been deleted by ${user.displayName}`)
  } else {
    logger.warn(`Bot with id ${botId} not found`)
  }

  return resultDelete
}

export async function approveBot(
  botId: string,
  approved: boolean,
  user: IUserMetadata
): Promise<mongo.UpdateResult> {
  logger.debug(
    `${user.displayName} is ${approved ? "approving" : "disapproving"} bot ${botId}`
  )
  const result = await BotV2.updateOne({ id: botId }, { $set: { approved } })
  if (result.modifiedCount > 0) {
    logger.info(`Bot with id ${botId} ${approved ? "approved" : "disapproved"}`)
    const botInRam = JSON.parse(await matchMaker.presence.hget("bots", botId))
    botInRam.approved = approved
    await matchMaker.presence.hset("bots", botId, JSON.stringify(botInRam))
  } else {
    logger.warn(`Bot with id ${botId} not found`)
  }

  return result
}
