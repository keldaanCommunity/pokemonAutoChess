import { matchMaker } from "colyseus"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import type { Booster } from "../types/Booster"
import { Rarity } from "../types/enum/Game"
import { logger } from "../utils/logger"

const BOOSTER_STATS_KEY_PREFIX = "booster:stats"
const DAY_IN_MS = 24 * 60 * 60 * 1000

type BoosterStats = {
  boostersCreated: number
  totalCards: number
  rarityCounts: Record<Rarity, number>
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function getBoosterStatsKey(date: Date): string {
  return `${BOOSTER_STATS_KEY_PREFIX}:${formatUtcDate(date)}`
}

function createEmptyRarityCounts(): Record<Rarity, number> {
  return Object.values(Rarity).reduce(
    (counts, rarity) => {
      counts[rarity] = 0
      return counts
    },
    {} as Record<Rarity, number>
  )
}

function parseBoosterStats(rawStats: Record<string, string>): BoosterStats {
  const rarityCounts = createEmptyRarityCounts()

  for (const rarity of Object.values(Rarity)) {
    rarityCounts[rarity] = Number(rawStats[`rarity:${rarity}`] ?? 0)
  }

  return {
    boostersCreated: Number(rawStats.boostersCreated ?? 0),
    totalCards: Number(rawStats.totalCards ?? 0),
    rarityCounts
  }
}

export async function recordBoosterCreation(boosterContent: Booster) {
  const key = getBoosterStatsKey(new Date())
  const rarityCounts = createEmptyRarityCounts()

  for (const card of boosterContent) {
    const rarity = getPokemonData(card.name).rarity
    rarityCounts[rarity] += 1
  }

  try {
    await matchMaker.presence.hincrby(key, "boostersCreated", 1)
    await matchMaker.presence.hincrby(key, "totalCards", boosterContent.length)

    await Promise.all(
      Object.entries(rarityCounts)
        .filter(([, count]) => count > 0)
        .map(([rarity, count]) =>
          matchMaker.presence.hincrby(key, `rarity:${rarity}`, count)
        )
    )
  } catch (error) {
    logger.warn("Failed to record booster creation stats", error)
  }
}

export async function logPreviousDayBoosterCreationStats() {
  const date = new Date(Date.now() - DAY_IN_MS)
  const key = getBoosterStatsKey(date)

  try {
    const rawStats = await matchMaker.presence.hgetall(key)

    if (Object.keys(rawStats).length === 0) {
      logger.info(
        `[CRON] Booster creation stats for ${formatUtcDate(date)}: no boosters created`
      )
      return
    }

    const stats = parseBoosterStats(rawStats)
    const byRarity = Object.values(Rarity)
      .map((rarity) => `${rarity}=${stats.rarityCounts[rarity]}`)
      .join(", ")

    logger.info(
      `[CRON] Booster creation stats for ${formatUtcDate(date)}: boosters=${stats.boostersCreated}, cards=${stats.totalCards}, byRarity=${byRarity}`
    )

    await Promise.all(
      Object.keys(rawStats).map((field) => matchMaker.presence.hdel(key, field))
    )
  } catch (error) {
    logger.error("Failed to log booster creation stats", error)
  }
}
