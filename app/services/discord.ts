import { EmbedBuilder, WebhookClient } from "discord.js"
import { IBot } from "../models/mongo-models/bot-v2"
import { IUserMetadataMongo } from "../types/interfaces/UserMetadata"
import { getAvatarSrc } from "../utils/avatar"
import { logger } from "../utils/logger"

let discordWebhook: WebhookClient | undefined
let discordBanWebhook: WebhookClient | undefined

if (process.env.DISCORD_WEBHOOK_URL) {
  discordWebhook = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL
  })
}

if (process.env.DISCORD_BAN_WEBHOOK_URL) {
  discordBanWebhook = new WebhookClient({
    url: process.env.DISCORD_BAN_WEBHOOK_URL
  })
}

export const discordService = {
  announceBan(
    user: IUserMetadataMongo,
    bannedUser: IUserMetadataMongo,
    reason: string
  ) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(`${user.displayName} banned the user ${bannedUser.displayName}`)
      .setAuthor({
        name: user.displayName,
        iconURL: getAvatarSrc(user.avatar)
      })
      .setDescription(
        `${user.displayName} banned the user ${bannedUser.displayName}. Reason: ${reason}`
      )
      .setThumbnail(getAvatarSrc(bannedUser.avatar))
    try {
      discordBanWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceUnban(user: IUserMetadataMongo, name: string) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(`${user.displayName} unbanned the user ${name}`)
      .setAuthor({
        name: user.displayName,
        iconURL: getAvatarSrc(user.avatar)
      })
      .setDescription(`${user.displayName} unbanned the user ${name}`)
      .setThumbnail(getAvatarSrc(user.avatar))
    try {
      discordBanWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceBotCreation(bot: IBot) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(`BOT ${bot.name} created by ${bot.author}`)
      .setAuthor({
        name: bot.author,
        iconURL: getAvatarSrc(bot.avatar)
      })
      .setDescription(
        `A new bot has been created by ${bot.author}, pending approval by a Bot Manager.`
      )
      .setThumbnail(getAvatarSrc(bot.avatar))

    try {
      discordWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceBotApproval(botData: IBot, approver: IUserMetadataMongo) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(
        `BOT ${botData.name} by @${botData.author} approved by ${approver.displayName}`
      )
      .setAuthor({
        name: approver.displayName,
        iconURL: getAvatarSrc(approver.avatar)
      })
      .setDescription(
        `BOT ${botData.name} by @${botData.author} approved by ${approver.displayName}`
      )
      .setThumbnail(getAvatarSrc(botData.avatar))
    try {
      discordWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  }
}
