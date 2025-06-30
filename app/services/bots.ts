import { logger } from "colyseus"
import { mongo } from "mongoose"
import { nanoid } from "nanoid"
import { rewriteBotRoundsRequiredto1, validateBot } from "../core/bot-logic"
import { BotV2, IBot, IStep } from "../models/mongo-models/bot-v2"
import { IUserMetadata } from "../models/mongo-models/user-metadata"
import { discordService } from "./discord"

export type IBotListItem = Omit<IBot, "steps"> & { valid: boolean }

export async function fetchBotsList(
  approved?: boolean
): Promise<IBotListItem[]> {
  const pageSize = 100

  const fetchPage = (page: number): Promise<IBot[]> => {
    return BotV2.find(
      {},
      {},
      { sort: { elo: -1 }, limit: pageSize, skip: page * pageSize }
    ).then((botsData) => {
      if (!botsData || botsData.length === 0) {
        return []
      }
      if (botsData.length < pageSize) {
        // Last chunk
        return botsData
      }
      // Wait for 10 seconds before fetching next page to not block the event loop
      return new Promise<IBot[]>((resolve) => setTimeout(resolve, 1000)).then(() =>
        fetchPage(page + 1).then((nextPageBotsData) => [
          ...botsData,
          ...nextPageBotsData
        ])
      )
    })
  }

  return fetchPage(0).then((bots) =>
    bots
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
  )
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
  user: IUserMetadata
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
  user: IUserMetadata
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
