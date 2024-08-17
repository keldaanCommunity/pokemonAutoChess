import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../types/interfaces/LeaderboardInfo"
import UserMetadata from "../models/mongo-models/user-metadata"
import { fetchBots } from "./bots"

let leaderboard = new Array<ILeaderboardInfo>()
let levelLeaderboard = new Array<ILeaderboardInfo>()
let botLeaderboard = new Array<ILeaderboardBotInfo>()

export function fetchLeaderboards() {
  return Promise.all([
    fetchUserLeaderboard(),
    fetchBotsLeaderboard(),
    fetchLevelLeaderboard()
  ])
}

export async function fetchUserLeaderboard() {
  const users = await UserMetadata.find(
    {},
    ["displayName", "avatar", "elo", "uid"],
    { limit: 100, sort: { elo: -1 } }
  )

  if (users) {
    leaderboard = users.map((user, i) => ({
      name: user.displayName,
      rank: i + 1,
      avatar: user.avatar,
      value: user.elo,
      id: user.uid
    }))
  }
  return leaderboard
}

export async function fetchLevelLeaderboard() {
  const levelUsers = await UserMetadata.find(
    {},
    ["displayName", "avatar", "level", "uid"],
    { limit: 100, sort: { level: -1 } }
  )

  if (levelUsers) {
    levelLeaderboard = levelUsers.map((user, i) => ({
      name: user.displayName,
      rank: i + 1,
      avatar: user.avatar,
      value: user.level,
      id: user.uid
    }))
  }

  return levelLeaderboard
}

export async function fetchBotsLeaderboard() {
  botLeaderboard = []
  const bots = await fetchBots()
  ;[...bots.values()].forEach((bot, i) => {
    botLeaderboard.push({
      name: bot.name,
      avatar: bot.avatar,
      rank: i + 1,
      value: bot.elo,
      author: bot.author
    })
  })
  return botLeaderboard
}

export function getLeaderboard() {
  return {
    leaderboard,
    botLeaderboard,
    levelLeaderboard
  }
}
