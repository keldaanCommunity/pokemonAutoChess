import { EmbedBuilder, WebhookClient } from "discord.js"
import { BASE_URL } from "../config"
import { IUserMetadataMongo } from "../types/interfaces/UserMetadata"
import type { IBot } from "../types/models/bot-v2"
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

const toAbsoluteURL = (url: string) => {
  if (url.startsWith("http")) return url
  return `${BASE_URL || "http://localhost:3000"}${url}`
}

export const discordService = {
  announceBan(
    user: IUserMetadataMongo,
    bannedUser: IUserMetadataMongo,
    reason: string
  ) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(
        `${user.displayName} banned the user ${bannedUser.displayName} (User ID: ${bannedUser.uid})`
      )
      .setAuthor({
        name: user.displayName,
        iconURL: toAbsoluteURL(getAvatarSrc(user.avatar))
      })
      .setDescription(`Reason: ${reason}`)
      .setThumbnail(toAbsoluteURL(getAvatarSrc(bannedUser.avatar)))
    try {
      discordBanWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  },

  announceUnban(
    user: IUserMetadataMongo,
    unbannedUser: IUserMetadataMongo,
    reason: string
  ) {
    const dsEmbed = new EmbedBuilder()
      .setTitle(
        `${user.displayName} unbanned the user ${unbannedUser.displayName} (User ID: ${unbannedUser.uid})`
      )
      .setAuthor({
        name: user.displayName,
        iconURL: toAbsoluteURL(getAvatarSrc(user.avatar))
      })
      .setDescription(`Reason: ${reason}`)
      .setThumbnail(toAbsoluteURL(getAvatarSrc(user.avatar)))
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
        iconURL: toAbsoluteURL(getAvatarSrc(bot.avatar))
      })
      .setDescription(
        `A new bot has been created by ${bot.author}, pending approval by a Bot Manager.`
      )
      .setThumbnail(toAbsoluteURL(getAvatarSrc(bot.avatar)))

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
        iconURL: toAbsoluteURL(getAvatarSrc(approver.avatar))
      })
      .setDescription(
        `BOT ${botData.name} by @${botData.author} approved by ${approver.displayName}`
      )
      .setThumbnail(toAbsoluteURL(getAvatarSrc(botData.avatar)))
    try {
      discordWebhook?.send({
        embeds: [dsEmbed]
      })
    } catch (error) {
      logger.error(error)
    }
  }
}
