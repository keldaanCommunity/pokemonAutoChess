import { logger } from "colyseus"
import { mongo } from "mongoose"
import { nanoid } from "nanoid"
import { BotV2, IBot, IStep } from "../models/mongo-models/bot-v2"
import { IUserMetadataMongo } from "../types/interfaces/UserMetadata"
import { discordService } from "./discord"

export type IBotListItem = Omit<IBot, "steps">

export async function fetchBotsList(
  approved?: boolean
): Promise<IBotListItem[]> {
  const pageSize = 100
  const maxPages = 20 // Fail-safe: prevent infinite loops (max 2000 bots)
  const allBots: IBotListItem[] = []

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  let page = 0
  let hasMoreData = true

  while (hasMoreData && page < maxPages) {
    try {
      // Build the query filter - apply approved filter at database level, not after
      const queryFilter: any = {}
      if (approved !== undefined) {
        queryFilter.approved = approved
      }

      const botsData = await BotV2.find(
        queryFilter, // Apply filter in the database query
        { steps: 0 }, // Exclude the 'steps' field
        { sort: { elo: -1, id: 1 }, limit: pageSize, skip: page * pageSize } // Add secondary sort by id for stable pagination
      )

      if (!botsData || botsData.length === 0) {
        hasMoreData = false
        break
      }

      const processedBots = botsData.map((bot) => ({
        name: bot.name,
        avatar: bot.avatar,
        id: bot.id,
        approved: bot.approved,
        author: bot.author,
        elo: bot.elo
      }))

      // Use push.apply to add elements without creating intermediate arrays
      allBots.push(...processedBots)

      if (botsData.length < pageSize) {
        // Last chunk
        hasMoreData = false
      } else {
        // Wait briefly before fetching next page to not block the event loop
        await wait(100)
        page++
      }
    } catch (error) {
      logger.error(`Error fetching bots page ${page}:`, error)
      hasMoreData = false // Stop on error to prevent infinite loop
    }
  }

  if (page >= maxPages) {
    logger.warn(`Reached maximum page limit (${maxPages}) while fetching bots`)
  }

  return allBots
}

export async function fetchBot(id: string): Promise<IBot | null> {
  try {
    const bot: IBot | null = await BotV2.findOne({ id }, {})
    return bot
  } catch (e) {
    logger.error(`Error fetching bot data id ${id}: ${e}`)
    return null
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
  discordService.announceBotCreation(resultCreate)
  return resultCreate
}

export async function deleteBotFromDatabase(
  botId: string,
  user: IUserMetadataMongo
): Promise<mongo.DeleteResult> {
  const resultDelete = await BotV2.deleteOne({ id: botId })
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
  user: IUserMetadataMongo
): Promise<mongo.UpdateResult> {
  logger.debug(
    `${user.displayName} is ${approved ? "approving" : "disapproving"} bot ${botId}`
  )
  const result = await BotV2.updateOne({ id: botId }, { $set: { approved } })
  if (result.modifiedCount > 0) {
    logger.info(`Bot with id ${botId} ${approved ? "approved" : "disapproved"}`)
  } else {
    logger.warn(`Bot with id ${botId} not found`)
  }

  return result
}
